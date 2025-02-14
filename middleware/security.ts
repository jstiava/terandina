

export default class SafeString {
  private value: string;
  private changed: boolean;

  constructor(input: any) {
    this.changed = false;
    this.value = this.escapeString(String(input));
  }

  private escapeString(input: string): string {
    let escaped = input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");

    escaped = escaped
      .replace(/\\/g, "\\\\")   // Escape backslashes
      .replace(/'/g, "\\'")     // Escape single quotes
      .replace(/"/g, '\\"')     // Escape double quotes
      .replace(/%/g, "\\%")     // Escape percentage signs
      .replace(/_/g, "\\_");    // Escape underscores

    if (input !== escaped) {
      this.changed = true;
    }

    return escaped;
  }

  toString(): string {
    return this.value;
  }

  toNumber(): number {
    return Number(this.value)
  }

  isTrue(): boolean {
    return this.value === "true";
  }

  // toDirectionality(): "bidirectional" | "from_group_to" | "from_profile_to" | "from_event_to" | "from_location_to" | "from_cert_to" | "from_child_event_to" {
  //   const theString = this.value.toString();

  //   if (theString === Type.Event) {
  //     return 'from_event_to'
  //   }
  //   if (theString === Type.Group) {
  //     return 'from_group_to'
  //   }
  //   if (theString === Type.Location) {
  //     return 'from_location_to'
  //   }
  //   if (theString === Type.Profile) {
  //     return 'from_profile_to'
  //   }
  //   if (theString === Type.Certificate) {
  //     return 'from_cert_to'
  //   }
  //   return 'bidirectional'
  // }
}
