
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { AlertTriangle, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SecretDevQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onFailure: () => void;
}

const quizOptions = [
  "Marco",
  "EmityGate",
  "Msm Mindmate",
  "WaizMarco",
  "Mohammed Waiz Monazzum",
];
const correctAnswer = "Mohammed Waiz Monazzum";

export function SecretDevQuizDialog({ open, onOpenChange, onSuccess, onFailure }: SecretDevQuizDialogProps) {
  const [isReady, setIsReady] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();

  const handleAnswer = () => {
    if (!selectedValue) return;

    setIsAnswered(true);
    if (selectedValue === correctAnswer) {
      setTimeout(() => {
        toast({ title: "Correct!", description: "Welcome to the VIP club, Marco-sama." });
        onSuccess();
        resetDialog();
      }, 1000);
    } else {
      setTimeout(() => {
        toast({ variant: "destructive", title: "Incorrect.", description: "The path to secrets is now closed." });
        onFailure();
        resetDialog();
      }, 1000);
    }
  };
  
  const resetDialog = () => {
    setIsReady(false);
    setSelectedValue(null);
    setIsAnswered(false);
    onOpenChange(false);
  }

  if (!isReady) {
    return (
       <Dialog open={open} onOpenChange={resetDialog}>
        <DialogContent>
            <AlertDialog defaultOpen={true}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    The Point of No Return
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                    You are about to take a one-time magical MCQ. If you choose the wrong answer, you will NEVER be able to access the developer secrets on this device again.
                    <br /><br />
                    Are you ready to prove your worth?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={resetDialog}>Maybe Later</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setIsReady(true)}>Let's Do It</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DialogContent>
       </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={resetDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            Who is the True Developer?
          </DialogTitle>
          <DialogDescription>
            Only a true connoisseur knows the answer. Choose wisely.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup 
            value={selectedValue || ""} 
            onValueChange={setSelectedValue}
            disabled={isAnswered}
          >
            {quizOptions.map((option) => {
              const isCorrect = option === correctAnswer;
              const isSelected = selectedValue === option;
              const isWrong = isSelected && !isCorrect;

              return (
                <Label
                  key={option}
                  htmlFor={option}
                  className={cn(
                    "flex items-center gap-4 rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent",
                    isAnswered && isSelected && isCorrect && "bg-green-100 border-green-400 text-green-800",
                    isAnswered && isSelected && isWrong && "bg-red-100 border-red-400 text-red-800",
                    isAnswered && !isSelected && "opacity-50"
                  )}
                >
                  <RadioGroupItem value={option} id={option} />
                  {option}
                </Label>
              );
            })}
          </RadioGroup>
        </div>
        <Button onClick={handleAnswer} disabled={!selectedValue || isAnswered}>
          Lock In Answer
        </Button>
      </DialogContent>
    </Dialog>
  );
}
