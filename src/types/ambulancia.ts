export type AmbulanciaForm = {
  movil: string
  placa: string
  conductor: string
  documentoConductor: string
  paramedico: string
  documentoParamedico: string
  tipoTraslado: string
}

export type AmbulanciaResponse = AmbulanciaForm & {
  id: number
  createdAt: string
  updatedAt: string
}
