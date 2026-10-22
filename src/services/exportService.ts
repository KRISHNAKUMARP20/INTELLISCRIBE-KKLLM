import { jsPDF } from 'jspdf';
import { Course, DocumentItem, Flashcard, Quiz, Summary } from '../types';

/**
 * Downloads a string as a file on client side
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// -------------------------------------------------------------
// MARKDOWN GENERATORS
// -------------------------------------------------------------

export function generateSummaryMarkdown(summary: Summary, documentTitle: string): string {
  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let md = `# Executive Summary: ${summary.title}\n\n`;
  md += `> **Source Document:** ${documentTitle}  \n`;
  md += `> **Generated with:** IntelliScribe AI Document-to-Knowledge Platform  \n`;
  md += `> **Export Date:** ${timestamp}  \n\n`;
  md += `---\n\n`;

  md += `## 1. Executive Summary\n\n`;
  md += `${summary.executiveSummary}\n\n`;

  md += `## 2. High-Yield Key Takeaways\n\n`;
  summary.keyTakeaways.forEach((takeaway, i) => {
    md += `${i + 1}. ${takeaway}\n`;
  });
  md += `\n`;

  if (summary.coreTheorems && summary.coreTheorems.length > 0) {
    md += `## 3. Core Theorems, Proof Foundations & Invariants\n\n`;
    summary.coreTheorems.forEach((thm, i) => {
      md += `### 3.${i + 1} ${thm.title}\n\n`;
      md += `${thm.explanation}\n\n`;
      if (thm.formulaOrCode) {
        md += `\`\`\`text\n${thm.formulaOrCode}\n\`\`\`\n\n`;
      }
    });
  }

  if (summary.outlineTree && summary.outlineTree.length > 0) {
    md += `## 4. Structured Outline & Concept Hierarchy\n\n`;
    const renderNode = (node: any, depth = 0) => {
      const indent = '  '.repeat(depth);
      md += `${indent}- **${node.title}**${node.description ? `: ${node.description}` : ''}\n`;
      if (node.children) {
        node.children.forEach((child: any) => renderNode(child, depth + 1));
      }
    };
    summary.outlineTree.forEach((root) => renderNode(root, 0));
    md += `\n`;
  }

  return md;
}

export function generateCourseNotesMarkdown(course: Course, documentTitle: string): string {
  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let md = `# Course Study Notes: ${course.title}\n\n`;
  md += `> **Course Code:** ${course.code}  \n`;
  md += `> **Difficulty:** ${course.level} | **Est. Time:** ${course.estimatedHours} Hours  \n`;
  md += `> **Source Document:** ${documentTitle}  \n`;
  md += `> **Generated with:** IntelliScribe AI Platform  \n`;
  md += `> **Export Date:** ${timestamp}  \n\n`;
  md += `---\n\n`;

  md += `## Course Overview\n\n`;
  md += `${course.description}\n\n`;

  course.modules.forEach((mod, modIdx) => {
    md += `## Module ${modIdx + 1}: ${mod.title}\n\n`;
    md += `*${mod.description}*\n\n`;

    mod.lessons.forEach((lesson, lesIdx) => {
      md += `### Lesson ${modIdx + 1}.${lesIdx + 1}: ${lesson.title}\n\n`;
      md += `**Reading Time:** ${lesson.durationMinutes} minutes | **Key Concepts:** ${lesson.keyConcepts.join(', ')}\n\n`;
      md += `#### Lesson Material\n\n`;
      md += `${lesson.contentMarkdown}\n\n`;

      if (lesson.deepDiveNotes) {
        md += `#### 💡 Professor's Deep Dive & Edge Cases\n\n`;
        md += `> ${lesson.deepDiveNotes.replace(/\n/g, '\n> ')}\n\n`;
      }

      if (lesson.audioScript) {
        md += `#### 🎙️ Synthesized Audio Transcript\n\n`;
        md += `*${lesson.audioScript}*\n\n`;
      }

      md += `---\n\n`;
    });
  });

  return md;
}

export function generateFlashcardsMarkdown(flashcards: Flashcard[], documentTitle: string): string {
  let md = `# Spaced Repetition Flashcard Deck\n\n`;
  md += `> **Source Material:** ${documentTitle}  \n`;
  md += `> **Total Cards:** ${flashcards.length}  \n\n`;
  md += `---\n\n`;

  flashcards.forEach((card, i) => {
    md += `### Card #${i + 1} [Box ${card.box} • ${card.tag}]\n\n`;
    md += `**Front (Question):**\n${card.front}\n\n`;
    md += `**Back (Answer):**\n${card.back}\n\n`;
    if (card.hint) {
      md += `*Hint:* ${card.hint}\n\n`;
    }
    md += `---\n\n`;
  });

  return md;
}

// -------------------------------------------------------------
// PDF GENERATORS (Clean Multi-Page Academic Formatting via jsPDF)
// -------------------------------------------------------------

export function exportSummaryPdf(summary: Summary, documentTitle: string) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin - 30) {
      doc.addPage();
      cursorY = margin;
      drawHeader();
    }
  };

  const drawHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 150);
    doc.text('INTELLISCRIBE • AI DOCUMENT-TO-KNOWLEDGE PLATFORM', margin, 28);
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, 33, pageWidth - margin, 33);
  };

  // First page banner
  drawHeader();
  cursorY += 20;

  // Document Tag
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(margin, cursorY, 130, 18, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229);
  doc.text('EXECUTIVE SYNTHESIS', margin + 8, cursorY + 12);
  cursorY += 26;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  const titleLines = doc.splitTextToSize(summary.title, contentWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 22;

  // Metadata Line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(`Source Document: ${documentTitle} | Generated: ${new Date().toLocaleDateString()}`, margin, cursorY);
  cursorY += 15;

  doc.setDrawColor(229, 231, 235);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 20;

  // 1. Executive Summary Box
  checkPageBreak(80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(31, 41, 55);
  doc.text('1. Executive Summary', margin, cursorY);
  cursorY += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  const execLines = doc.splitTextToSize(summary.executiveSummary, contentWidth - 20);
  const boxHeight = execLines.length * 15 + 16;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursorY, contentWidth, boxHeight, 4, 4, 'FD');
  doc.text(execLines, margin + 10, cursorY + 16);
  cursorY += boxHeight + 22;

  // 2. High-Yield Key Takeaways
  checkPageBreak(60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(31, 41, 55);
  doc.text('2. High-Yield Key Takeaways', margin, cursorY);
  cursorY += 14;

  summary.keyTakeaways.forEach((takeaway, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(55, 65, 81);
    const itemLines = doc.splitTextToSize(`${idx + 1}.  ${takeaway}`, contentWidth);
    checkPageBreak(itemLines.length * 14 + 6);
    doc.text(itemLines, margin, cursorY);
    cursorY += itemLines.length * 14 + 6;
  });
  cursorY += 14;

  // 3. Core Theorems & Formulas
  if (summary.coreTheorems && summary.coreTheorems.length > 0) {
    checkPageBreak(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.text('3. Core Theorems & Invariants', margin, cursorY);
    cursorY += 14;

    summary.coreTheorems.forEach((thm, idx) => {
      checkPageBreak(50);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229);
      doc.text(`3.${idx + 1}  ${thm.title}`, margin, cursorY);
      cursorY += 14;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      const explLines = doc.splitTextToSize(thm.explanation, contentWidth);
      doc.text(explLines, margin, cursorY);
      cursorY += explLines.length * 13 + 6;

      if (thm.formulaOrCode) {
        checkPageBreak(28);
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(margin, cursorY, contentWidth, 22, 3, 3, 'F');
        doc.setFont('courier', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
        doc.text(thm.formulaOrCode, margin + 8, cursorY + 14);
        cursorY += 30;
      }
    });
  }

  // 4. Outline Tree
  if (summary.outlineTree && summary.outlineTree.length > 0) {
    checkPageBreak(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.text('4. Concept Hierarchy & Mindmap Outline', margin, cursorY);
    cursorY += 14;

    const printTree = (node: any, depth = 0) => {
      doc.setFont('helvetica', depth === 0 ? 'bold' : 'normal');
      doc.setFontSize(depth === 0 ? 9.5 : 8.5);
      doc.setTextColor(depth === 0 ? 31 : 75, depth === 0 ? 41 : 85, depth === 0 ? 55 : 99);
      const indent = depth * 14;
      const text = `${depth > 0 ? '• ' : ''}${node.title}${node.description ? ` (${node.description})` : ''}`;
      const lines = doc.splitTextToSize(text, contentWidth - indent);
      checkPageBreak(lines.length * 13 + 4);
      doc.text(lines, margin + indent, cursorY);
      cursorY += lines.length * 13 + 4;

      if (node.children) {
        node.children.forEach((c: any) => printTree(c, depth + 1));
      }
    };

    summary.outlineTree.forEach((root) => printTree(root, 0));
  }

  // Page Numbers Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Page ${i} of ${totalPages} • IntelliScribe Knowledge Suite`,
      pageWidth / 2,
      pageHeight - 20,
      { align: 'center' }
    );
  }

  const cleanFilename = `${documentTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_summary.pdf`;
  doc.save(cleanFilename);
}

export function exportCourseNotesPdf(course: Course, documentTitle: string) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin - 30) {
      doc.addPage();
      cursorY = margin;
      drawHeader();
    }
  };

  const drawHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 150);
    doc.text(`INTELLISCRIBE • COURSE NOTES: ${course.code}`, margin, 28);
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, 33, pageWidth - margin, 33);
  };

  drawHeader();
  cursorY += 20;

  // Course Badge
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(margin, cursorY, 80, 18, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229);
  doc.text(course.code, margin + 8, cursorY + 12);
  cursorY += 26;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  const titleLines = doc.splitTextToSize(course.title, contentWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 22;

  // Meta
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Level: ${course.level} | Estimated Study: ${course.estimatedHours} hrs | Source: ${documentTitle}`,
    margin,
    cursorY
  );
  cursorY += 14;

  doc.setDrawColor(229, 231, 235);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 18;

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(55, 65, 81);
  const descLines = doc.splitTextToSize(course.description, contentWidth);
  doc.text(descLines, margin, cursorY);
  cursorY += descLines.length * 14 + 18;

  // Modules & Lessons
  course.modules.forEach((mod, modIdx) => {
    checkPageBreak(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(31, 41, 55);
    doc.text(`Module ${modIdx + 1}: ${mod.title}`, margin, cursorY);
    cursorY += 15;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    const modDesc = doc.splitTextToSize(mod.description, contentWidth);
    doc.text(modDesc, margin, cursorY);
    cursorY += modDesc.length * 13 + 14;

    mod.lessons.forEach((les, lesIdx) => {
      checkPageBreak(50);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(79, 70, 229);
      doc.text(`Lesson ${modIdx + 1}.${lesIdx + 1}: ${les.title}`, margin, cursorY);
      cursorY += 14;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(107, 114, 128);
      doc.text(
        `Duration: ${les.durationMinutes} min read • Concepts: ${les.keyConcepts.join(', ')}`,
        margin,
        cursorY
      );
      cursorY += 14;

      // Clean Markdown plain text
      const cleanContent = les.contentMarkdown
        .replace(/```[a-z]*\n?/g, '')
        .replace(/### /g, '')
        .replace(/#### /g, '')
        .replace(/\*\*/g, '');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      const textLines = doc.splitTextToSize(cleanContent, contentWidth);
      checkPageBreak(textLines.length * 13);
      doc.text(textLines, margin, cursorY);
      cursorY += textLines.length * 13 + 12;

      // Deep dive box
      if (les.deepDiveNotes) {
        checkPageBreak(40);
        doc.setFillColor(245, 243, 255);
        doc.setDrawColor(221, 214, 254);

        const ddLines = doc.splitTextToSize(
          `Deep Dive Notes: ${les.deepDiveNotes.replace(/\*\*/g, '')}`,
          contentWidth - 16
        );
        const ddHeight = ddLines.length * 12 + 14;

        doc.roundedRect(margin, cursorY, contentWidth, ddHeight, 3, 3, 'FD');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(109, 40, 217);
        doc.text(ddLines, margin + 8, cursorY + 12);
        cursorY += ddHeight + 16;
      }
    });
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Page ${i} of ${totalPages} • IntelliScribe Knowledge Suite`,
      pageWidth / 2,
      pageHeight - 20,
      { align: 'center' }
    );
  }

  const cleanFilename = `${course.code}_${course.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_notes.pdf`;
  doc.save(cleanFilename);
}
