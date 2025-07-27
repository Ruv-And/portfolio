// (Imports remain unchanged)
import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  NgZone,
  HostListener
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { easing } from 'maath';
import { TextGeometry, FontLoader } from 'three-stdlib';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  link: string;
}

@Component({
  selector: 'app-fluid-glass',
  imports: [CommonModule],
  templateUrl: './fluid-glass.component.html',
})
export class FluidGlassComponent implements AfterViewInit, OnDestroy {
  @Input() navItems: NavItem[] = [
    { label: 'Home', link: '' },
    { label: 'About', link: '' },
    { label: 'Contact', link: '' },
  ];
  @Input() modeProps: any = {};
  @Input() scrollProgress = 0;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene = new THREE.Scene();
  private buffer?: THREE.WebGLRenderTarget;
  private frameId: any;
  private pointer = { x: 0, y: 0 };

  private meshLoaded = false;
  private fontLoaded = false;

  private textMesh?: THREE.Mesh;
  private imgPlane?: THREE.Mesh;

  constructor(private host: ElementRef, private ngZone: NgZone) {}

  ngAfterViewInit() {
    const canvas = this.host.nativeElement.querySelector('canvas') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    this.camera = new THREE.PerspectiveCamera(15, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 20);
    this.buffer = new THREE.WebGLRenderTarget(canvas.clientWidth, canvas.clientHeight);

    this.loadBarModeModel();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frameId);
    this.renderer.dispose();
    this.buffer?.dispose();
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(evt: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((evt.clientY - rect.top) / rect.height) * 2 - 1);
  }

  public navigate(link: string) {
    if (!link) return;
    link.startsWith('#') ? (window.location.hash = link) : (window.location.href = link);
  }

  private loadBarModeModel() {
    const loader = new GLTFLoader();
    loader.load('/assets/3d/bar.glb', gltf => {
      const mesh = gltf.scene.getObjectByName('Cube') as THREE.Mesh;
      if (!mesh || !mesh.geometry) return;

      mesh.rotation.x = Math.PI / 2;
      this.scene.add(mesh);

      mesh.userData = {
        geoWidth: (() => {
          mesh.geometry.computeBoundingBox();
          const bb = mesh.geometry.boundingBox!;
          return bb.max.x - bb.min.x || 1;
        })()
      };

      this.meshLoaded = true;

      this.setupTypography();
      this.setupImagePlanes();
      this.ngZone.runOutsideAngular(() => this.animate(mesh));
    });
  }

  private setupTypography(): void {
    const loader = new FontLoader();
    loader.load('assets/fonts/helvetiker_regular.typeface.json', font => {
      const geometry = new TextGeometry('Angular Bits', {
        font,
        size: 1,
        height: 0.05,
      });

      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      this.textMesh = new THREE.Mesh(geometry, material);
      this.textMesh.position.set(0, 0, 12);
      this.scene.add(this.textMesh);

      this.fontLoaded = true;
    });
  }

  private setupImagePlanes() {
    const tex = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1595001354022-29103be3b73a?q=80&w=3270');
    const geom = new THREE.PlaneGeometry(3, 3);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    this.imgPlane = new THREE.Mesh(geom, mat);
    this.imgPlane.position.set(-2, 0, 9);
    this.scene.add(this.imgPlane);
  }

  private animate(mesh: THREE.Mesh) {
    const props = {
      transmission: 1,
      roughness: 0,
      thickness: 10,
      ior: 1.15,
      color: '#ffffff',
      attenuationColor: '#ffffff',
      attenuationDistance: 0.25,
      ...(this.modeProps || {})
    };

    const loop = () => {
      const cw = this.renderer.domElement.clientWidth;
      const ch = this.renderer.domElement.clientHeight;
      const vWidth = cw / ch * 2;

      easing.damp3(mesh.position, [0, -1 + 0.2, 15], 0.15, 0.016);

      if (props.scale == null) {
        const desired = (vWidth * 0.9) / mesh.userData['geoWidth'];
        mesh.scale.setScalar(Math.min(0.15, desired));
      } else {
        mesh.scale.setScalar(props.scale);
      }

      if (this.scrollProgress != null && this.textMesh && this.textMesh.material instanceof THREE.MeshBasicMaterial) {
        const sp = this.scrollProgress;
        const textMaterial = this.textMesh.material;

        textMaterial.transparent = true;
        textMaterial.opacity = 1 - Math.min(1, sp / 0.2);
      }

      if (this.scrollProgress != null && this.imgPlane) {
        const sp = this.scrollProgress;
        if (sp < 0.3) {
          const s = 1 + (sp / 0.3) * 0.5;
          this.imgPlane.scale.set(s, s, 1);
        }
      }

      this.renderer.setRenderTarget(this.buffer!);
      this.renderer.render(this.scene, this.camera);
      this.renderer.setRenderTarget(null);
      this.renderer.setClearColor(0x5227ff, 1);
      this.renderer.render(this.scene, this.camera);

      this.frameId = requestAnimationFrame(loop);
    };

    loop();
  }
}
