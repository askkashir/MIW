/**
 * Core data model for a journal entry.
 *
 * Timestamps use Unix millis (Date.now()) so they are
 * easy to serialize, sort, and convert for display.
 */

export interface JournalEntry {
  /** Unique identifier (UUID v4) */
  id: string;

  /** ID of the user who authored the entry */
  userId: string;

  /** The journal entry body text */
  content: string;

  /** Unix-millisecond timestamp when the entry was first created */
  createdAt: number;

  /** Unix-millisecond timestamp of the last edit */
  updatedAt: number;
}
