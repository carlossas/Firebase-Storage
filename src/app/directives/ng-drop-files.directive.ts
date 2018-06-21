// IMPORTACIONES NECESARIAS PARA EL DRAG AND DROP
import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
// INTERFAZ
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  constructor() { }
  // RECIBO MI ARREGLO ARCHIVOS
  @Input () archivos: FileItem [] = [];
  // EVENTO CUANDO EL MOUSE ESTA SOBRE LA ZONA DE DRAG AND DROP
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();
  //EVENTO CUANDO ESTA SOBRE LA ZONA DROP
  @HostListener('dragover', ['$event'])
  public onDragEnter (event: any){
    this.mouseSobre.emit( true );
    // PREVIENEQUE EL NAVEGADOR ABRA LA IMAGEN CUANDO SUELTE
    this._prevenirDetener( event );
  }
  //EVENTO CUANDO SALE DE LA ZONA DROP
  @HostListener('dragleave', ['$event'])
  public onDragLeave (event: any){
    this.mouseSobre.emit( false );
  }
  @HostListener('drop', ['$event'])
  public onDrop (event: any){
    

    const transferencia = this._getTransferencia( event );
    // SI NO HAY NADA EN LA TRANSFERENCIA NO HACE NADA
    if( !transferencia ){
      return;
    }
    // LLAMO MI FUNCION PARA EXTRAER LOS ARCHIVOS
    this._extraerArchivos ( transferencia.files );
    // PREVIENEQUE EL NAVEGADOR ABRA LA IMAGEN CUANDO SUELTE
    this._prevenirDetener( event );
    // EMITE EL EVENTO DROP
    this.mouseSobre.emit( false );

  }


    // DETECA LA TRANSFERENCIA 
  private _getTransferencia ( event: any ){
    return  event.dataTransfer ? event.dataTransfer : event.original.dataTransfer;
  }

  // EXTRAE LA INFORMACION DE LOS ARCHIVOS
  private _extraerArchivos( archivosLista: FileList){

    for (const propiedad in Object.getOwnPropertyNames( archivosLista ) ){
      const archivoTemporal = archivosLista [propiedad];

      if ( this._archivoPuedeSerCargado ( archivoTemporal ) ){
        const nuevoArchivo = new FileItem ( archivoTemporal );
        this.archivos.push ( nuevoArchivo );
      }
    }
    console.log ("Archivos Dropeados", this.archivos)

  }

  // VALIDACIONES

  //SI EL ARCHIVO YA FUE DROPEADO Y ES UNA IMAGEN
  private _archivoPuedeSerCargado ( archivo: File ) : boolean {
    if ( !this._archivoYaFueDropeado ( archivo.name ) && this._esimagen( archivo.type )){
      return true;
    }
    return false;
  }

  //PREVIENE QUE EL NAVEGADOR ABRA LA IMAGEN
  private _prevenirDetener (event){
    event.preventDefault();
    event.stopPropagation();
  }

  //PREVIENE QUE INGRESE OTRO ARCHIVO CUANDO YA HAY UNO CARGADO
  private _archivoYaFueDropeado ( nombreArchivo: string ) : boolean {
    for ( const archivo of this.archivos ){
      if ( archivo.nombreArchivo == nombreArchivo ){
        console.log ("El archivo: ", nombreArchivo, "ya esta agregado");
        return true;
      }
    }
    return false;
  }

  //VERIFICAR QUE SEAN IMAGENES, SOLO IMAGENES
  private _esimagen (tipoArchivo: string) : boolean{
    return  ( tipoArchivo === '' || tipoArchivo === undefined ) ? false :
    tipoArchivo.startsWith('image');
  }
}
