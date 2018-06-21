import { Component, OnInit } from '@angular/core';
// INTERFAZ
import { FileItem } from '../../models/file-item';
// SERVICIO
import { CargaImagenesService } from '../../services/carga-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css']
})
export class CargaComponent implements OnInit {
  // ARREGLO DE ARCHIVOS TIPO FILEITEM (INTERFAZ)
  archivos:FileItem [] = [];
  // DETECA EL DRAG AND DROP
  estaSobreElemento: boolean = false;

  constructor( public cargaImgService:CargaImagenesService) { }

  ngOnInit() {
  }

  cargarImagen(){
    this.cargaImgService.cargarImagenesFirebase(this.archivos)

  }

  limpiarArchivos(){
    this.archivos = [];
  }

  
}
