
/**
 * Generates spaces for a given indentation depth.
 * Uses 4 spaces per indent level as per standard Python PEP 8 guidelines.
 */
export function indent(depth: number): string {
  return " ".repeat(depth * 4);
}