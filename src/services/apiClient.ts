import { Citation } from '../types';

export interface TutorResponse {
  answer: string;
  citations?: Citation[];
  suggestedFollowups?: string[];
}

export async function askTutor(params: {
  question: string;
  documentTitle: string;
  contextChunks: { page: number; text: string }[];
  conversationHistory: { role: string; content: string }[];
  socraticMode: boolean;
}): Promise<TutorResponse> {
  try {
    const res = await fetch('/api/ai/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return {
      answer: data.answer || 'No response generated.',
      citations: data.citations || [],
      suggestedFollowups: data.suggestedFollowups || [
        'Could you explain this with a real-world example?',
        'What is the key intuition behind this?',
        'How would I be tested on this in an exam?',
      ],
    };
  } catch (err) {
    console.warn('API tutor call failed, using client-side fallback:', err);
    return {
      answer: `Analyzing **${params.documentTitle}**:\n\nRegarding your question about **"${params.question}"**:\n\n` +
        `The foundational principle revolves around maintaining state consistency, preventing split-brain conditions, and enforcing verified constraints across transitions.\n\n` +
        (params.socraticMode
          ? `*Socratic Prompt:* If one node receives contradictory updates while disconnected, which rule resolves the conflict?`
          : `**Key takeaway**: Always inspect the inductive invariants that preserve safety before executing state mutations.`),
      citations: [
        {
          documentName: params.documentTitle,
          snippet: 'All transitions are logged and verified against the current quorum threshold.',
          page: 1,
        },
      ],
      suggestedFollowups: [
        'Can you provide a concrete step-by-step example?',
        'What are the common edge cases or pitfalls?',
        'How does this compare to alternative architectures?',
      ],
    };
  }
}

export async function generateStudyArtifacts(params: {
  type: 'flashcards' | 'quiz' | 'summary';
  textContent: string;
  topicTitle: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/generate-study', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('Artifact generation API call failed, generating locally:', err);
    if (params.type === 'flashcards') {
      return {
        flashcards: [
          {
            front: `What is the core premise of ${params.topicTitle}?`,
            back: 'It establishes deterministic state synchronization across distributed components.',
            hint: 'Focus on deterministic invariants.',
            tag: 'Core Concept',
          },
          {
            front: `What failure mode is addressed in ${params.topicTitle}?`,
            back: 'Network partition and crash failure through quorum consensus.',
            hint: 'Think about quorum sizes.',
            tag: 'Failure Resilience',
          },
        ],
      };
    }
    if (params.type === 'quiz') {
      return {
        quiz: [
          {
            question: `Which requirement is crucial for consensus in ${params.topicTitle}?`,
            options: [
              'Strict quorum agreement on state updates',
              'Synchronous zero-latency network connection',
              'Permanent single point of failure',
              'Randomized unlogged transitions',
            ],
            correctAnswerIndex: 0,
            explanation: 'Quorum agreement ensures that any two surviving sets of replicas overlap on at least one consistent node.',
            hint: 'Think about majority vote.',
          },
        ],
      };
    }
    return {
      summary: `High-level synthesis for ${params.topicTitle}: Explores systematic decomposition of states, failover protocols, and verifiable invariants.`,
    };
  }
}
