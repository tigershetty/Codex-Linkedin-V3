// Full-page route wrapper for RunDetailPanel.
// Gets runId from React Router useParams and delegates all rendering
// to the shared RunDetailPanel component.
import { useParams } from "react-router-dom";
import RunDetailPanel from "../components/RunDetailPanel";

export default function RunDetail() {
  const { runId } = useParams();
  return <RunDetailPanel runId={runId} />;
}
