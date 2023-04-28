import { Component, OnInit } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Ubicacion } from '../ubicaciones/ubicaciones/ubicacion.model';
import { UbicacionesService } from '../ubicaciones/ubicaciones/ubicaciones.service';
import { Mantenimiento } from '../mantenimientos/mantenimientos/mantenimiento.model';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {
  mantenimientos:any[] = [];

  ubicacionDef:Ubicacion;
  constructor(private ubicacionesService:UbicacionesService) {
  }

  ngOnInit() {
    this.ubicacionesService.obtenerUbicacion("6433fd9ad7d0ebc8c67a8647").subscribe((ubicacion:Ubicacion)=>{
      this.ubicacionDef = ubicacion;
      var cont = 0;
      ubicacion.mantenimientos.forEach(element=>{
        this.mantenimientos[cont] = {
          descripcion:element.descripcion,
          periocidad:element.periocidad,
          estado:element.estado,
          corregido:element.corregido,
          observaciones:element.observaciones,
          fecha:element.fecha,
        }
        cont++;
      })
    });
  }


  obtenerMantenimientos(ubicacion: Ubicacion) {

    //this.mantenimientos = ubicacion.mantenimientos;


  }

  construirTabla2(datos,columnas) {
    var body = [];
    body.push(columnas);

    datos.forEach(function (row){
      var dataRow = [];
      columnas.forEach(function (column){
        dataRow.push(row[column]+"");
      });
      body.push(dataRow)
    });
    return body;
  }
  tabla2(datos,columnas) {
    return {
      table:{
        headerRows:1,
        body:this.construirTabla2(datos,columnas)
      }
    }
  }

  crearPdf2() {
    const pdfDefinition: any = {
      content: [
          { text: `      Informes de mantenimiento del ${this.ubicacionDef.nombre}

          `, style: 'header' },
          this.tabla2(this.mantenimientos, ['descripcion', 'periocidad', 'estado', 'corregido', 'observaciones','fecha'])
      ]
    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }








/*
  construirTabla(datos,columnas,c2) {
    var body = [];
    body.push(columnas);
    body.push(c2);

    datos.forEach(function (row){
      var dataRow = [];
      columnas.forEach(function (column){

      });
    });


  }



  tabla(datos,columnas,c2) {
    return {
      table:{
        headerRows:9,
        body:this.construirTabla(datos,columnas,c2)
      }
    }
  }
  crearPdf() {
    const pdfDefinition: any = {
      content: [
        {
          table: {
            body: [
              [
                'id',
                'descripcion',
                'estado',
                'corregido',
                'observaciones',
                'imagenes',
                'periocidad',
                'fecha',
                'item a modificar',
              ],

              /* [{text:this.mantenimientos[0]}
              ],
            ]
          }
        }
      ]
    }


    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }
 */
}
