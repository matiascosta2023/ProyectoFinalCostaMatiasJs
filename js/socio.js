class CuotaSocio {

    nombre;
    tipoDocumento;
    documento;
    importe;
    nroCuota;
    cuotaPaga;
    idCuota;

    constructor (nombre, tipoDocumento, documento, socio, importe, nroCuota, cuotaPaga, idCuota){
        this.nombre = nombre;
        this.tipoDocumento = tipoDocumento;
        this.documento = documento;
        this.socio = socio;
        this.importe = importe;
        this.nroCuota = nroCuota;
        this.cuotaPaga = cuotaPaga;
        this.idCuota = idCuota;
    }

    pagarCuota = function (pagaCuota){
        this.cuotaPaga = pagaCuota;
    }
}