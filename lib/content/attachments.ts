/**
 * Documents attached to content: scans of certificates and award letters,
 * hosted outside the site. Shown as buttons that open in a new tab.
 */
export type Attachment = {
  /** Button text, lowercase: "certificate", "participation certificate". */
  label: string
  href: string
}

/** A file shared from Google Drive with "anyone with the link". */
export const driveFile = (id: string) =>
  `https://drive.google.com/file/d/${id}/view`
