import ProgressBar from "./ProgressBar";

const steps = ["Тема", "Возраст", "Рассказчик"];

type WizardHeaderProps = {
  step: number;
};

export default function WizardHeader({ step }: WizardHeaderProps) {
  const progress = (step / steps.length) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>Шаг {step} из {steps.length}</span>
        <span>{steps[step - 1]}</span>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
}
