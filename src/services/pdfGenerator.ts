import { PDFDocument, PDFImage, PDFPage, PDFFont, rgb, StandardFonts } from 'pdf-lib'
import type { AphForm, AphPayload } from '../types/aph'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89

const MARGIN_X = 10
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2

const SECTION_HEIGHT = 10
const LABEL_HEIGHT = 7.5
const LABEL_VALUE_GAP = 2.8
const VALUE_HEIGHT = 9.5
const ROW_HEIGHT = LABEL_HEIGHT + LABEL_VALUE_GAP + VALUE_HEIGHT

const LABEL_FONT_SIZE = 5.8
const VALUE_FONT_SIZE = 5.4
const SECTION_FONT_SIZE = 6.6

type AphFull = AphPayload
type AphData = AphForm


interface Ctx {
  doc: PDFDocument
  page: PDFPage
  bold: PDFFont
  normal: PDFFont
}

type Cell = {
  label: string
  value: string
  span: number
}

type InlineCell = {
  label: string
  value: string
}

export async function generatePdf(data: AphFull, logoBase64?: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])

  const bold = await doc.embedFont(StandardFonts.TimesRomanBold)
  const normal = await doc.embedFont(StandardFonts.TimesRoman)

  const ctx: Ctx = {
    doc,
    page,
    bold,
    normal,
  }

  let y = PAGE_HEIGHT - 16

  y = await drawHeader(ctx, y, data, logoBase64)

  y = drawSection(ctx, y, 'DATOS DEL PACIENTE')
  y = drawPatientData(ctx, y, data)

  y = drawSection(ctx, y, 'CAUSA EXTERNA')
  y = drawExternalCause(ctx, y, data)

  y = drawSection(ctx, y, 'ANTECEDENTES PERSONALES')
  y = drawPersonalHistory(ctx, y, data)

  y = drawPhysicalExam(ctx, y, data)

  y = drawSection(ctx, y, 'UBICACION DE LAS LESIONES')
  y = await drawInjuryLocation(ctx, y, data)

  y = drawSection(ctx, y, 'DIAGNOSTICOS  /  HALLAZGOS')
  y = drawDiagnosisAndFindings(ctx, y, data)

  y = drawSection(ctx, y, 'PROCEDIMIENTOS REALIZADOS')
  y = drawProcedures(ctx, y, data)

  y = drawSection(ctx, y, 'MATERIALES Y DROGAS UTILIZADAS')
  y = drawMaterials(ctx, y, data)

  y = drawSection(ctx, y, 'FIRMAS / SELLOS')
  drawSignatures(ctx, y, data)

  drawFooter(ctx)

  return doc.save()
}

async function drawHeader(ctx: Ctx, y: number, data: AphData, logoBase64?: string): Promise<number> {
  const top = y

  if (logoBase64) {
    try {
      const logoBytes = base64ToBytes(removeBase64Prefix(logoBase64))
      const logo = await embedImage(ctx.doc, logoBytes, logoBase64)

      ctx.page.drawImage(logo, {
        x: MARGIN_X + 46,
        y: top - 58,
        width: 58,
        height: 50,
      })
    } catch {
      // Logo is optional. The PDF can still be generated without it.
    }
  }

  drawCenteredText(ctx.page, 'ATENCIÃ“N PRE-HOSPITALARIA', PAGE_WIDTH / 2, top - 24, ctx.bold, 11.5)

  ctx.page.drawText('FAPH v1', {
    x: PAGE_WIDTH - 105,
    y: top - 20,
    font: ctx.bold,
    size: 8.5,
  })

  ctx.page.drawText('01/03/2025', {
    x: PAGE_WIDTH - 113,
    y: top - 35,
    font: ctx.bold,
    size: 8.5,
  })

  const infoY = top - 72

  ctx.page.drawText('Placa:', {
    x: MARGIN_X + 4,
    y: infoY,
    font: ctx.bold,
    size: 7,
  })

  ctx.page.drawText(nvl(data.placa), {
    x: MARGIN_X + 34,
    y: infoY,
    font: ctx.bold,
    size: 7,
  })

  ctx.page.drawText('Movil:', {
    x: PAGE_WIDTH / 2 - 80,
    y: infoY,
    font: ctx.bold,
    size: 7,
  })

  ctx.page.drawText(nvl(data.movil), {
    x: PAGE_WIDTH / 2 - 44,
    y: infoY,
    font: ctx.bold,
    size: 7,
  })

  return top - 84
}

function drawSection(ctx: Ctx, y: number, title: string): number {
  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: y - SECTION_HEIGHT,
    width: CONTENT_WIDTH,
    height: SECTION_HEIGHT,
    color: rgb(0.64, 0.64, 0.64),
  })

  drawCenteredText(ctx.page, title, PAGE_WIDTH / 2, y - 7, ctx.bold, SECTION_FONT_SIZE)

  return y - SECTION_HEIGHT
}

function drawPatientData(ctx: Ctx, y: number, data: AphData): number {
  y = tableRow(ctx, y, [
    cell('Tipo ID', inferType(data.documento), 1),
    cell('No. de IdentificaciÃ³n', nvl(data.documento), 2),
    cell('Nombres y Apellidos', fullName(data), 4),
    cell('Sexo', nvl(data.sexo), 1),
    cell('CÃ³digo CUPS', nvl(data.codigo), 1),
    cell('Tipo de traslado', nvl(data.tipoTraslado), 2),
    cell('Prioridad', nvl(data.prioridad), 1),
  ])

  y = tableRow(ctx, y, [
    cell('Fecha de traslado', nvl(data.fechaAccidente), 2),
    cell('Hora de traslado', nvl(data.horaAccidente), 2),
    cell('Lugar de ocurrencia de la atenciÃ³n', nvl(data.lugarOcurrencia), 5),
    cell('Zona', nvl(data.zonaOrigen), 1),
    cell('Departamento', nvl(data.departamentoOrigen), 2),
    cell('Municipio', nvl(data.municipioOrigen), 2),
  ])

  y = tableRow(ctx, y, [
    cell('Fecha de Nacimiento', nvl(data.fechaNacimiento), 3),
    cell('Edad', nvl(data.edad), 1),
    cell('Estado Civil', nvl(data.estadoCivil), 3),
    cell('OcupaciÃ³n', nvl(data.ocupacion), 3),
    cell('Celular', nvl(data.celular), 2),
  ])

  y = tableRow(ctx, y, [
    cell('DirecciÃ³n de Residencia', nvl(data.direccion), 5),
    cell('Telefono', nvl(data.telefono), 2),
    cell('Zona', nvl(data.zonaPaciente), 1),
    cell('Departamento', nvl(data.departamento), 2),
    cell('Municipio', nvl(data.ciudad), 2),
  ])

  y = tableRow(ctx, y, [
    cell('Nombres del AcompaÃ±ante', nvl(data.acompanante), 4),
    cell('No. de telefono', nvl(data.celularAcompanante), 2),
    cell('Avisar a', nvl(data.avisarA), 3),
    cell('Parentesco', nvl(data.parentesco), 2),
    cell('No. de telefono', nvl(data.numeroParaAvisar), 2),
  ])

  y = tableRow(ctx, y, [
    cell('Aseguradora Responsable del paciente', nvl(data.aseguradora), 5),
    cell('Poliza o No carnet', nvl(data.poliza), 3),
    cell('DescripciÃ³n del plan de beneficios', nvl(data.planBeneficios), 5),
  ])

  return tableRow(ctx, y, [
    cell('Hora de llegada', nvl(data.horaLlegada), 2),
    cell('Transportado a', nvl(data.transportadoA), 4),
    cell('Cod HabilitaciÃ³n', nvl(data.codigoHabilitacion), 3),
    cell('Departamento', nvl(data.departamentoTraslado), 2),
    cell('Municipio', nvl(data.ciudadTransporte), 2),
    cell('Estado', nvl(data.estadoPaciente), 1),
  ])
}

function drawExternalCause(ctx: Ctx, y: number, data: AphData): number {
  return inlineRow(ctx, y, [
    {
      label: 'Causa Externa Origina la Atencion',
      value: nvl(data.causaExterna),
    },
    {
      label: 'Motivo de Consulta',
      value: nvl(data.diagnosticos),
    },
  ])
}

function drawPersonalHistory(ctx: Ctx, y: number, data: AphData): number {
  return tableRow(ctx, y, [
    cell('Alergias', nvl(data.alergia), 1),
    cell('Liquidos y Alimentos', nvl(data.liquidos), 2),
    cell('Medicacion', nvl(data.medicacion), 2),
    cell('Patologicos', nvl(data.patologicos), 2),
  ])
}

function drawPhysicalExam(ctx: Ctx, y: number, data: AphData): number {
  const ratio = 0.68
  const leftW = CONTENT_WIDTH * ratio
  const rightW = CONTENT_WIDTH - leftW

  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: y - SECTION_HEIGHT,
    width: leftW,
    height: SECTION_HEIGHT,
    color: rgb(0.64, 0.64, 0.64),
  })

  ctx.page.drawRectangle({
    x: MARGIN_X + leftW,
    y: y - SECTION_HEIGHT,
    width: rightW,
    height: SECTION_HEIGHT,
    color: rgb(0.64, 0.64, 0.64),
  })

  drawCenteredText(ctx.page, 'EXAMEN FISICO', MARGIN_X + leftW / 2, y - 7, ctx.bold, SECTION_FONT_SIZE)
  drawCenteredText(ctx.page, 'GLASGOW', MARGIN_X + leftW + rightW / 2, y - 7, ctx.bold, SECTION_FONT_SIZE)

  y -= SECTION_HEIGHT

  return tableRow(ctx, y, [
    cell('PA', nvl(data.presion), 1),
    cell('FC', nvl(data.frecuenciaCardiaca), 1),
    cell('FR', nvl(data.frecuenciaRespiratoria), 1),
    cell('Temp', nvl(data.temperatura), 1),
    cell('RO', nvl(data.ro), 1),
    cell('RV', nvl(data.rv), 1),
    cell('RM', nvl(data.rm), 1),
  ])
}

async function drawInjuryLocation(ctx: Ctx, y: number, data: AphFull): Promise<number> {
  const panelHeight = 165

  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: y - panelHeight,
    width: CONTENT_WIDTH,
    height: panelHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.25,
  })

  if (data.lesionesImagen && data.lesionesImagen.trim()) {
    try {
      const image = await embedBase64Image(ctx.doc, data.lesionesImagen)

      drawImageContained(ctx.page, image, {
        x: MARGIN_X,
        y: y - panelHeight,
        width: CONTENT_WIDTH,
        height: panelHeight,
        paddingX: 145,
        paddingY: 6,
      })
    } catch {
      drawMissingInjuryImage(ctx, y, panelHeight)
    }
  } else {
    drawMissingInjuryImage(ctx, y, panelHeight)
  }

  return y - panelHeight
}

function drawMissingInjuryImage(ctx: Ctx, y: number, panelHeight: number): void {
  const title = 'Imagen de lesiones no disponible'
  const subtitle = 'Verifique que lesionesImagen llegue desde el front'

  drawCenteredText(ctx.page, title, PAGE_WIDTH / 2, y - panelHeight / 2 + 8, ctx.bold, 8)
  drawCenteredText(ctx.page, subtitle, PAGE_WIDTH / 2, y - panelHeight / 2 - 6, ctx.normal, 6)
}

function drawDiagnosisAndFindings(ctx: Ctx, y: number, data: AphData): number {
  const labelW = 85
  const valueW = CONTENT_WIDTH - labelW

  const diagnosisHeight = 18

  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: y - diagnosisHeight,
    width: labelW,
    height: diagnosisHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.25,
  })

  ctx.page.drawRectangle({
    x: MARGIN_X + labelW,
    y: y - diagnosisHeight,
    width: valueW,
    height: diagnosisHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.25,
  })

  ctx.page.drawText('Diagnostico CIE10', {
    x: MARGIN_X + 4,
    y: y - 11,
    font: ctx.bold,
    size: LABEL_FONT_SIZE,
  })

  ctx.page.drawText(truncate(nvl(data.diagnosticos), Math.floor(valueW / 3)), {
    x: MARGIN_X + labelW + 4,
    y: y - 11,
    font: ctx.bold,
    size: VALUE_FONT_SIZE,
  })

  y -= diagnosisHeight

  const findingsHeight = 48

  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: y - findingsHeight,
    width: labelW,
    height: findingsHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.25,
  })

  ctx.page.drawRectangle({
    x: MARGIN_X + labelW,
    y: y - findingsHeight,
    width: valueW,
    height: findingsHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.25,
  })

  drawCenteredText(ctx.page, 'Describa sus', MARGIN_X + labelW / 2, y - 15, ctx.bold, LABEL_FONT_SIZE)
  drawCenteredText(ctx.page, 'hallazgos', MARGIN_X + labelW / 2, y - 23, ctx.bold, LABEL_FONT_SIZE)

  drawWrappedText(ctx.page, nvl(data.hallazgos), {
    x: MARGIN_X + labelW + 4,
    y: y - 10,
    width: valueW - 8,
    maxLines: 5,
    lineHeight: 7,
    font: ctx.bold,
    size: 5.8,
  })

  return y - findingsHeight
}

function drawProcedures(ctx: Ctx, y: number, data: AphFull): number {
  const height = 15
  const value = data.procedimientos?.join(', ') || ''

  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: y - height,
    width: CONTENT_WIDTH,
    height: height,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.25,
  })

  drawCenteredText(ctx.page, truncate(value, Math.floor(CONTENT_WIDTH / 3)), PAGE_WIDTH / 2, y - 10, ctx.bold, VALUE_FONT_SIZE)

  return y - height
}

function drawMaterials(ctx: Ctx, y: number, data: AphData): number {
  const height = 15
  const value = nvl(data.materiales)

  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: y - height,
    width: CONTENT_WIDTH,
    height: height,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.25,
  })

  drawCenteredText(ctx.page, truncate(value, Math.floor(CONTENT_WIDTH / 3)), PAGE_WIDTH / 2, y - 10, ctx.bold, VALUE_FONT_SIZE)

  return y - height
}

function drawSignatures(ctx: Ctx, y: number, data: AphData): number {
  const colW = CONTENT_WIDTH / 3

  y = tableRow(ctx, y, [
    cell('Conductor', joinPersonDoc(data.conductor, data.documentoConductor), 1),
    cell('Encargado del Traslado', joinPersonDoc(data.paramedico, data.documentoParamedico), 1),
    cell('Quien recibe al paciente', joinPersonDoc(data.medico, data.documentoMedico), 1),
  ])

  const signatureHeight = 58

  for (let i = 0; i < 3; i++) {
    ctx.page.drawRectangle({
      x: MARGIN_X + i * colW,
      y: y - signatureHeight,
      width: colW,
      height: signatureHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.25,
    })
  }

  drawCenteredText(ctx.page, 'Firma  /  Paciente o Responsable', MARGIN_X + colW / 2, y - 12, ctx.bold, LABEL_FONT_SIZE)
  drawCenteredText(ctx.page, 'Firma  /  Sello Encargado del Traslado', MARGIN_X + colW + colW / 2, y - 12, ctx.bold, LABEL_FONT_SIZE)
  drawCenteredText(ctx.page, 'Firma  /  Sello Quien recibe al paciente', MARGIN_X + colW * 2 + colW / 2, y - 12, ctx.bold, LABEL_FONT_SIZE)

  return y - signatureHeight
}

function drawFooter(ctx: Ctx): void {
  const footerY = 24
  const height = 21

  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: footerY - height,
    width: CONTENT_WIDTH,
    height,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.25,
  })

  ctx.page.drawText(
      'El profesional de la salud certifica que las lesiones en el presente documento corresponden a hallazgos clÃ­nicos ocurridos como consecuencia de accidente de transito.',
      {
        x: MARGIN_X + 4,
        y: footerY - 8,
        font: ctx.normal,
        size: 5.8,
      },
  )

  ctx.page.drawText('ArtÃ­culo 32 Decreto 056 de 2015 Ministerio de Salud y ProtecciÃ³n Social', {
    x: MARGIN_X + 4,
    y: footerY - 16,
    font: ctx.normal,
    size: 5.8,
  })
}

function tableRow(ctx: Ctx, y: number, cells: Cell[]): number {
  const totalSpan = cells.reduce((sum, current) => sum + current.span, 0)
  let x = MARGIN_X

  for (const currentCell of cells) {
    const width = (CONTENT_WIDTH * currentCell.span) / totalSpan

    drawCenteredText(ctx.page, currentCell.label, x + width / 2, y - 5.6, ctx.bold, LABEL_FONT_SIZE)

    const valueBoxY = y - LABEL_HEIGHT - LABEL_VALUE_GAP - VALUE_HEIGHT
    const value = truncate(currentCell.value, Math.floor((width - 6) / (VALUE_FONT_SIZE * 0.5)))

    ctx.page.drawRectangle({
      x: x + 1,
      y: valueBoxY,
      width: width - 2,
      height: VALUE_HEIGHT,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.25,
    })

    drawCenteredText(ctx.page, value, x + width / 2, valueBoxY + 3.2, ctx.normal, VALUE_FONT_SIZE)

    x += width
  }

  return y - ROW_HEIGHT
}

function inlineRow(ctx: Ctx, y: number, cells: InlineCell[]): number {
  const rowHeight = 17
  const width = CONTENT_WIDTH / cells.length
  let x = MARGIN_X

  for (const currentCell of cells) {
    ctx.page.drawRectangle({
      x,
      y: y - rowHeight,
      width,
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.25,
    })

    ctx.page.drawText(currentCell.label, {
      x: x + 5,
      y: y - 11,
      font: ctx.bold,
      size: LABEL_FONT_SIZE,
    })

    ctx.page.drawText(truncate(currentCell.value, Math.floor((width - 180) / 3)), {
      x: x + 175,
      y: y - 11,
      font: ctx.normal,
      size: VALUE_FONT_SIZE,
    })

    x += width
  }

  return y - rowHeight
}

async function embedBase64Image(doc: PDFDocument, base64Image: string): Promise<PDFImage> {
  const cleanBase64 = removeBase64Prefix(base64Image)
  const bytes = base64ToBytes(cleanBase64)
  return embedImage(doc, bytes, base64Image)
}

async function embedImage(doc: PDFDocument, bytes: Uint8Array, source: string): Promise<PDFImage> {
  if (source.startsWith('data:image/jpeg') || source.startsWith('data:image/jpg')) {
    return doc.embedJpg(bytes)
  }

  return doc.embedPng(bytes)
}

function drawImageContained(
    page: PDFPage,
    image: PDFImage,
    box: {
      x: number
      y: number
      width: number
      height: number
      paddingX: number
      paddingY: number
    },
): void {
  const availableWidth = box.width - box.paddingX * 2
  const availableHeight = box.height - box.paddingY * 2

  if (availableWidth <= 0 || availableHeight <= 0) {
    return
  }

  const imageRatio = image.width / image.height
  const boxRatio = availableWidth / availableHeight

  let drawWidth = availableWidth
  let drawHeight = availableHeight

  if (imageRatio > boxRatio) {
    drawHeight = drawWidth / imageRatio
  } else {
    drawWidth = drawHeight * imageRatio
  }

  const imageX = box.x + (box.width - drawWidth) / 2
  const imageY = box.y + (box.height - drawHeight) / 2

  page.drawImage(image, {
    x: imageX,
    y: imageY,
    width: drawWidth,
    height: drawHeight,
  })
}

function drawWrappedText(
    page: PDFPage,
    value: string,
    options: {
      x: number
      y: number
      width: number
      maxLines: number
      lineHeight: number
      font: PDFFont
      size: number
    },
): void {
  const lines = wrapText(value, options.width, options.font, options.size)

  lines.slice(0, options.maxLines).forEach((line, index) => {
    page.drawText(line, {
      x: options.x,
      y: options.y - index * options.lineHeight,
      font: options.font,
      size: options.size,
    })
  })
}

function wrapText(value: string, width: number, font: PDFFont, size: number): string[] {
  const text = nvl(value)

  if (!text) {
    return ['']
  }

  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word

    if (measureWidth(candidate, font, size) <= width) {
      current = candidate
    } else {
      if (current) {
        lines.push(current)
      }

      current = word
    }
  }

  if (current) {
    lines.push(current)
  }

  return lines
}

function drawCenteredText(
    page: PDFPage,
    text: string,
    centerX: number,
    y: number,
    font: PDFFont,
    size: number,
): void {
  const safeText = nvl(text)
  page.drawText(safeText, {
    x: centerX - measureWidth(safeText, font, size) / 2,
    y,
    font,
    size,
  })
}

function cell(label: string, value: string, span: number): Cell {
  return {
    label,
    value,
    span,
  }
}

function joinPersonDoc(name: string, doc: string): string {
  return [nvl(name), nvl(doc)].filter(Boolean).join(' ')
}

function fullName(data: AphData): string {
  return [nvl(data.primerNombre), nvl(data.primerApellido)].filter(Boolean).join(' ')
}

function inferType(doc: string): string {
  const length = nvl(doc).length

  if (length >= 10) {
    return 'CC'
  }

  if (length >= 6) {
    return 'CE'
  }

  return 'TI'
}

function truncate(value: string, max: number): string {
  const safeValue = nvl(value)

  if (safeValue.length <= max) {
    return safeValue
  }

  return `${safeValue.slice(0, Math.max(0, max - 3))}...`
}

function nvl(value: string | null | undefined): string {
  return value && value.trim() ? value : ''
}

function removeBase64Prefix(base64: string): string {
  return base64.includes(',') ? base64.substring(base64.indexOf(',') + 1) : base64
}

function measureWidth(text: string, font: PDFFont, size: number): number {
  if (!text) {
    return 0
  }

  return font.widthOfTextAtSize(text, size)
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}
