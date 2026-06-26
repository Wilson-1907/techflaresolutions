import { AccessibilityToolbar } from "./AccessibilityToolbar";
import { FocusAnnouncer } from "./FocusAnnouncer";

export function AccessibilitySuite() {
  return (
    <>
      <AccessibilityToolbar />
      <FocusAnnouncer />
    </>
  );
}
