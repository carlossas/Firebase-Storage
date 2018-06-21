import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';

@Injectable()
export class CargaImagenesService {
  //CARPETA DONDE SE GUARDARAN LAS IMAGENES
  private CARPETA_IMAGENES = 'img';

  constructor( private db: AngularFirestore ) { }
                                  // ESTO SE PUEDE HACER CON UNA INTERFAZ MEJOR
  private guardarImagen( imagen: { nombre:string, url:string } ){
    this.db.collection (`/${ this.CARPETA_IMAGENES }`)
        .add( imagen );
  }

  cargarImagenesFirebase( imagenes:FileItem [] ){
    console.log("Imagenes: ", imagenes)

    const storageRef = firebase.storage().ref();

    for ( const item of imagenes ){
      item.estaSubiendo = true;
      if ( item.progreso >= 100 ){
        continue;
      }
      // CARPETA Y NOMBRE DE LAS IMAGENES
      const  uploadTask: firebase.storage.UploadTask =
             storageRef.child(`/${ this.CARPETA_IMAGENES }/${ item.nombreArchivo }`)
                        .put ( item.archivo );
    // CALBACKS
    uploadTask.on ( firebase.storage.TaskEvent.STATE_CHANGED,
      ( snapshot:firebase.storage.UploadTaskSnapshot ) => 
        item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100, // CALCULA EL PROGRESO
      ( error ) => console.error("Error al subir", error), // IMPRIME EL ERROR
      () => {
        console.log("Imagen cargada correctamente")
        // ASIGNO LOS VALORES DE FIREBASE A MI ITEM
        item.url = uploadTask.snapshot.downloadURL;
        item.estaSubiendo = false;
        
        //LLAMO A MI FUNCION PARA GUARDAR LOS DATOS DE LA IMAGEN EN LA BASE DE DATOS
        this.guardarImagen({
          nombre: item.nombreArchivo,
          url: item.url
        })
      });
    } 

  }

}
