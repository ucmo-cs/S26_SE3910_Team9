import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Stepper from "../components/ui/Stepper";
import { page, stack, section, grid2, rowBetween, row } from "../styles/layout";
import { button, buttonPrimary, buttonGhost, divider, h2, input, label, muted } from "../styles/ui";

type Topic = { id: string; name: string };
type Branch = { id: string; name: string; topicIds: string[] };
type Slot = { id: string; dateLabel: string; timeLabel: string; isBooked: boolean };

const topics: Topic[] = [
  { id: "t1", name: "Open a new account" },
  { id: "t2", name: "Credit card support" },
  { id: "t3", name: "Loan consultation" },
  { id: "t4", name: "Mortgage questions" },
];

const branches: Branch[] = [
  { id: "b1", name: "Downtown Branch", topicIds: ["t1", "t2", "t4"] },
  { id: "b2", name: "West Branch", topicIds: ["t2", "t3"] },
  { id: "b3", name: "East Branch", topicIds: ["t1", "t3", "t4"] },
];

const allSlots: Slot[] = [
  { id: "s1", dateLabel: "Fri, Feb 20", timeLabel: "9:00 AM", isBooked: false },
  { id: "s2", dateLabel: "Fri, Feb 20", timeLabel: "9:30 AM", isBooked: true },
  { id: "s3", dateLabel: "Fri, Feb 20", timeLabel: "10:00 AM", isBooked: false },
  { id: "s4", dateLabel: "Fri, Feb 20", timeLabel: "10:30 AM", isBooked: false },
  { id: "s5", dateLabel: "Sat, Feb 21", timeLabel: "11:00 AM", isBooked: false },
  { id: "s6", dateLabel: "Sat, Feb 21", timeLabel: "11:30 AM", isBooked: true },
  { id: "s7", dateLabel: "Sat, Feb 21", timeLabel: "1:00 PM", isBooked: false },
];

type StepId = "topic" | "branch" | "time" | "details" | "confirm";

function AppointmentCreate() {
  const navigate = useNavigate();

  const steps = ["Topic", "Branch", "Time", "Details", "Confirm"];
  const [step, setStep] = useState<StepId>("topic");

  const [topicId, setTopicId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [slotId, setSlotId] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const currentIndex = useMemo(() => {
    if (step === "topic") return 0;
    if (step === "branch") return 1;
    if (step === "time") return 2;
    if (step === "details") return 3;
    return 4;
  }, [step]);

  const selectedTopic = useMemo(() => topics.find((t) => t.id === topicId) ?? null, [topicId]);
  const availableBranches = useMemo(() => {
    if (!topicId) return [];
    return branches.filter((b) => b.topicIds.includes(topicId));
  }, [topicId]);

  const selectedBranch = useMemo(() => branches.find((b) => b.id === branchId) ?? null, [branchId]);
  const availableSlots = useMemo(() => allSlots.filter((s) => !s.isBooked), []);

  const selectedSlot = useMemo(() => allSlots.find((s) => s.id === slotId) ?? null, [slotId]);

  function goNext() {
    if (step === "topic") setStep("branch");
    else if (step === "branch") setStep("time");
    else if (step === "time") setStep("details");
    else if (step === "details") setStep("confirm");
  }

  function goBack() {
    if (step === "confirm") setStep("details");
    else if (step === "details") setStep("time");
    else if (step === "time") setStep("branch");
    else if (step === "branch") setStep("topic");
  }

  const canNext =
    (step === "topic" && !!topicId) ||
    (step === "branch" && !!branchId) ||
    (step === "time" && !!slotId) ||
    (step === "details" && customerName.trim().length > 0 && customerEmail.trim().length > 0) ||
    step === "confirm";

  function submitMock() {
    // Prototype: pretend we saved and go to a mock detail page
    // In real app: POST to backend, reserve slot, return appointmentId
    navigate("/appointments/a1");
  }

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Book an Appointment"
          subtitle="Mock wizard (no backend). Select a topic, branch, time, then confirm."
          right={
            <Link to="/appointments" className={button}>
              View Appointments
            </Link>
          }
        />

        <Stepper steps={steps} currentIndex={currentIndex} />

        {step === "topic" ? (
          <Card>
            <div className={section}>
              <div className={h2}>1) What can we help you with?</div>
              <div className={muted}>Choose a topic. Branches will filter based on support.</div>

              <div className={grid2}>
                {topics.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`${button} ${t.id === topicId ? "bg-slate-900 text-white" : "bg-white border"}`}
                    onClick={() => {
                      setTopicId(t.id);
                      setBranchId("");
                      setSlotId("");
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ) : null}

        {step === "branch" ? (
          <Card>
            <div className={section}>
              <div className={h2}>2) Choose a branch</div>
              <div className={muted}>
                Topic: <span className="font-semibold">{selectedTopic ? selectedTopic.name : "None"}</span>
              </div>

              <div className={grid2}>
                {availableBranches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`${button} ${b.id === branchId ? "bg-slate-900 text-white" : "bg-white border"}`}
                    onClick={() => {
                      setBranchId(b.id);
                      setSlotId("");
                    }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              {availableBranches.length === 0 ? (
                <div className={muted}>No branches support that topic (mock scenario).</div>
              ) : null}
            </div>
          </Card>
        ) : null}

        {step === "time" ? (
          <Card>
            <div className={section}>
              <div className={h2}>3) Select date & time (30 min slots)</div>
              <div className={muted}>
                Branch: <span className="font-semibold">{selectedBranch ? selectedBranch.name : "None"}</span>
              </div>

              <div className={grid2}>
                {availableSlots.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`${button} ${s.id === slotId ? "bg-slate-900 text-white" : "bg-white border"}`}
                    onClick={() => setSlotId(s.id)}
                  >
                    {s.dateLabel} • {s.timeLabel}
                  </button>
                ))}
              </div>

              <div className={muted}>Booked slots are hidden in this prototype.</div>
            </div>
          </Card>
        ) : null}

        {step === "details" ? (
          <Card>
            <div className={section}>
              <div className={h2}>4) Your details</div>
              <div className={muted}>Enter name and email (mock). No email is actually sent.</div>

              <div className={grid2}>
                <div className={section}>
                  <div className={label}>Name</div>
                  <input className={input} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </div>

                <div className={section}>
                  <div className={label}>Email</div>
                  <input
                    className={input}
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>
        ) : null}

        {step === "confirm" ? (
          <Card>
            <div className={section}>
              <div className={h2}>5) Confirm</div>
              <div className={muted}>Review the appointment info before “reserving” (mock).</div>

              <div className={divider} />

              <div className={section}>
                <div className={rowBetween}>
                  <div className="font-semibold">Topic</div>
                  <div>{selectedTopic ? selectedTopic.name : "-"}</div>
                </div>
                <div className={rowBetween}>
                  <div className="font-semibold">Branch</div>
                  <div>{selectedBranch ? selectedBranch.name : "-"}</div>
                </div>
                <div className={rowBetween}>
                  <div className="font-semibold">Time</div>
                  <div>{selectedSlot ? `${selectedSlot.dateLabel} • ${selectedSlot.timeLabel}` : "-"}</div>
                </div>
                <div className={rowBetween}>
                  <div className="font-semibold">Name</div>
                  <div>{customerName || "-"}</div>
                </div>
                <div className={rowBetween}>
                  <div className="font-semibold">Email</div>
                  <div>{customerEmail || "-"}</div>
                </div>
              </div>

              <div className={divider} />

              <div className={row}>
                <button type="button" className={`${button} ${buttonPrimary}`} onClick={submitMock}>
                  Confirm & Reserve (mock)
                </button>
                <button type="button" className={`${button} ${buttonGhost}`} onClick={() => setStep("topic")}>
                  Start Over
                </button>
              </div>
            </div>
          </Card>
        ) : null}

        <Card>
          <div className={rowBetween}>
            <button type="button" className={`${button} ${buttonGhost}`} onClick={goBack} disabled={step === "topic"}>
              Back
            </button>

            <button
              type="button"
              className={`${button} ${buttonPrimary}`}
              onClick={goNext}
              disabled={!canNext || step === "confirm"}
            >
              Next
            </button>
          </div>
          <div className={`mt-2 ${muted}`}>
            This is a prototype: availability + reservation are simulated in-memory only.
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AppointmentCreate;
