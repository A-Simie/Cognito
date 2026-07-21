import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Highlighter,
  Type,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AjibadePanel } from "@/components/features/ajibade";
import { BottomSheet } from "@/components/layout/BottomSheet";
import { useIsMobile } from "@/lib/hooks/activity/useMediaQuery";

export default function PDFTutor() {
  const [isAjibadeOpen, setIsAjibadeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(5);
  const totalPages = 120;
  const isMobile = useIsMobile();

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-6 py-3 bg-white dark:bg-gray-800 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-3 text-primary dark:text-white"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
              Cognito
            </h2>
          </Link>
          <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-lg p-1">
            <a
              className="text-gray-900 dark:text-white text-sm font-medium leading-normal px-3 py-1.5 rounded bg-white dark:bg-white/10 shadow-sm"
              href="#"
            >
              Study
            </a>
            <a
              className="text-gray-500 dark:text-white/60 text-sm font-medium leading-normal px-3 py-1.5 hover:text-primary transition-colors"
              href="#"
            >
              Library
            </a>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Physics 101</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-900 dark:text-white font-medium">
            Thermodynamics.pdf
          </span>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        <section className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-lg border border-gray-100 dark:border-gray-600">
            <button className="p-2 text-gray-600 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors">
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-xs font-medium px-2 min-w-12 text-center dark:text-white">
              100%
            </span>
            <button className="p-2 text-gray-600 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors">
              <ZoomIn className="w-5 h-5" />
            </button>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-500 mx-1" />
            <button className="p-2 text-primary cursor-pointer hover:bg-primary/5 rounded-full transition-colors">
              <Type className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors">
              <Highlighter className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center py-8 px-4 sm:px-8">
            <div className="w-full max-w-[700px] min-h-[1000px] bg-white text-gray-900 shadow-xl rounded-sm p-12 md:p-16 relative">
              <div className="flex justify-between items-end border-b-2 border-black mb-8 pb-2">
                <h1 className="text-3xl font-serif font-bold tracking-tight">
                  Chapter 4: Thermodynamics
                </h1>
                <span className="text-sm font-mono text-gray-500">
                  Page {currentPage}
                </span>
              </div>

              <div className="prose prose-lg max-w-none font-serif text-justify leading-relaxed">
                <h3 className="font-bold text-xl mb-4">
                  4.1 The First Law of Thermodynamics
                </h3>
                <p className="mb-4">
                  The first law of thermodynamics is a version of the law of
                  conservation of energy, adapted for thermodynamic systems. The
                  law of conservation of energy states that the total energy of
                  an isolated system is constant; energy can be transformed from
                  one form to another, but can be neither created nor destroyed.
                </p>
                <p className="mb-4 relative">
                  <span className="bg-yellow-200/50 px-1 py-0.5 rounded -mx-1">
                    For a thermodynamic cycle, the net heat supplied to the
                    system equals the net work done by the system.
                  </span>{" "}
                  This fundamental principle governs the operation of heat
                  engines and refrigerators. Mathematically, this is expressed
                  as <em className="font-serif">ΔU = Q - W</em>, where ΔU is the
                  change in internal energy, Q is the heat added to the system,
                  and W is the work done by the system.
                </p>
                <p className="mb-4">
                  Consider a gas enclosed in a cylinder with a movable piston.
                  If we heat the gas, it expands and pushes the piston outward.
                  <span className="bg-yellow-200/50 px-1 py-0.5 rounded -mx-1">
                    {" "}
                    In this process, the heat energy added is converted into the
                    internal energy of the gas (raising its temperature) and
                    mechanical work (moving the piston).
                  </span>
                </p>
              </div>

              <div className="absolute bottom-8 left-0 w-full text-center text-xs text-gray-400 font-mono">
                Physics 101 - Module 4 - Thermodynamics
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900/80 dark:bg-white/10 backdrop-blur-md text-white py-2 px-4 rounded-full shadow-lg z-10 cursor-pointer">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium tabular-nums">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {!isMobile && (
          <AjibadePanel
            className="w-[450px] shrink-0 hidden lg:flex"
            onSendMessage={(msg) => console.log("PDF Question:", msg)}
          />
        )}
      </main>

      {isMobile && (
        <>
          <button
            onClick={() => setIsAjibadeOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:bg-primary/90 transition-colors z-30"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <BottomSheet
            isOpen={isAjibadeOpen}
            onClose={() => setIsAjibadeOpen(false)}
          >
            <AjibadePanel
              className="h-[70vh] border-0"
              onSendMessage={(msg) => console.log("PDF Question:", msg)}
            />
          </BottomSheet>
        </>
      )}
    </div>
  );
}
