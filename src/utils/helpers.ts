import { jsPDF } from 'jspdf';
import { Project, Task, ContactPartner, MeetingEvent } from '../types';

/**
 * Plays a discrete, pleasant notification chime using the Web Audio API
 */
export function playChimeSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // First note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    // Second note (harmonic chord)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (err) {
    console.warn('Audio chime could not be played automatically:', err);
  }
}

/**
 * Downloads a file directly in browser or mobile device
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates an iCalendar (.ics) string for external calendar synchronization
 */
export function generateIcsCalendar(meetings: MeetingEvent[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Startup GK//Sistema de Gestao TI//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Startup GK - Reuniões e Prazos'
  ];

  meetings.forEach((m) => {
    // Format YYYYMMDDTHHmmSSZ
    const cleanDate = m.date.replace(/-/g, '');
    const cleanStart = m.startTime.replace(/:/g, '') + '00';
    const cleanEnd = m.endTime.replace(/:/g, '') + '00';
    
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:gk-${m.id}@startupgk.com`);
    lines.push(`DTSTAMP:${cleanDate}T120000Z`);
    lines.push(`DTSTART:${cleanDate}T${cleanStart}`);
    lines.push(`DTEND:${cleanDate}T${cleanEnd}`);
    lines.push(`SUMMARY:${m.title}`);
    lines.push(`DESCRIPTION:${m.notes || ''} (Participantes: ${m.participants.join(', ')})`);
    lines.push(`LOCATION:${m.locationOrUrl || 'Google Meet'}`);
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Creates Google Calendar quick-add URL
 */
export function createGoogleCalendarUrl(m: MeetingEvent): string {
  const cleanDate = m.date.replace(/-/g, '');
  const cleanStart = m.startTime.replace(/:/g, '') + '00';
  const cleanEnd = m.endTime.replace(/:/g, '') + '00';
  const dates = `${cleanDate}T${cleanStart}/${cleanDate}T${cleanEnd}`;
  
  const text = encodeURIComponent(m.title);
  const details = encodeURIComponent(`${m.notes || ''}\n\nLink: ${m.meetLink || m.locationOrUrl}\nParticipantes: ${m.participants.join(', ')}`);
  const location = encodeURIComponent(m.locationOrUrl || 'Google Meet');
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Generates an executive PDF report for external analysis using jsPDF
 */
export function generatePdfReport(
  projects: Project[],
  tasks: Task[],
  contacts: ContactPartner[],
  generatedBy: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent band
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 42, pageWidth, 3, 'F');

  // Company Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('STARTUP GK - EMPRESA DE TI', 16, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Aplicações Web • Sites Institucionais • Páginas Publicitárias de Alta Conversão', 16, 27);
  doc.text(`Relatório Executivo Confidencial | Gerado em: ${new Date().toLocaleDateString('pt-BR')} por ${generatedBy}`, 16, 34);

  let y = 56;

  // 1. Resumo Executivo
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. Indicadores Chave de Desempenho (KPIs)', 16, y);
  y += 6;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const avgProgress = Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / (projects.length || 1));
  const activeLeadsValue = contacts.reduce((acc, c) => acc + c.estimatedValue, 0);
  const urgentTasks = tasks.filter(t => t.priority === 'urgente').length;

  doc.rect(16, y, pageWidth - 32, 24);
  doc.setFont('helvetica', 'bold');
  doc.text(`Projetos Ativos: ${projects.length}`, 22, y + 8);
  doc.text(`Pipeline Contratos: R$ ${totalBudget.toLocaleString('pt-BR')}`, 22, y + 16);

  doc.text(`Média Progresso: ${avgProgress}%`, 110, y + 8);
  doc.text(`Pipeline CRM Leads: R$ ${activeLeadsValue.toLocaleString('pt-BR')}`, 110, y + 16);
  y += 32;

  // 2. Status dos Projetos em Andamento
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. Painel de Projetos de TI da Startup GK', 16, y);
  y += 8;

  doc.setFontSize(9);
  projects.forEach((proj, idx) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(248, 250, 252);
    doc.rect(16, y, pageWidth - 32, 18, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(16, y, pageWidth - 32, 18, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${proj.name} (${proj.type.toUpperCase()})`, 20, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Cliente: ${proj.client} | Prazo: ${proj.deadline} | Valor: R$ ${proj.budget.toLocaleString('pt-BR')}`, 20, y + 12);
    doc.text(`Progresso: ${proj.progress}% | Time: ${proj.team.join(', ')}`, 110, y + 12);

    y += 22;
  });

  y += 4;

  // 3. Controle de Tarefas Prioritárias
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`3. Controle de Tarefas e Sprints (${urgentTasks} Urgentes)`, 16, y);
  y += 8;

  tasks.slice(0, 5).forEach((task) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(task.priority === 'urgente' ? 220 : 30, task.priority === 'urgente' ? 38 : 41, task.priority === 'urgente' ? 38 : 59);
    doc.text(`[${task.priority.toUpperCase()}] ${task.title}`, 20, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Responsável: ${task.assignedTo} | Projeto: ${task.projectName} | Status: ${task.status}`, 20, y);
    y += 8;
  });

  y += 4;

  // 4. Contatos & Parceiros Recentes
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('4. Relação de Parceiros Estratégicos & Conversões', 16, y);
  y += 8;

  contacts.slice(0, 4).forEach((c) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${c.companyName} (${c.status})`, 20, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Contato: ${c.contactPerson} (${c.role}) | Tel: ${c.phone} | E-mail: ${c.email}`, 20, y);
    y += 8;
  });

  // Footer on last page
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Startup GK TI - Documento confidencial de governança interna da equipe.', 16, 287);

  doc.save(`StartupGK_Relatorio_Executivo_${new Date().toISOString().slice(0, 10)}.pdf`);
}
