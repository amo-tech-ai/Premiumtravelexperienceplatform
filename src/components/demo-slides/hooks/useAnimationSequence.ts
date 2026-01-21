/**
 * useAnimationSequence Hook
 * Orchestrates the entire animation sequence with precise timing
 */

import { useState, useEffect, useRef } from 'react';
import { animationSequence } from '../config/animationConfig';

export type AnimationStep = 
  | 'idle'
  | 'location'
  | 'search'
  | 'filter'
  | 'result'
  | 'map'
  | 'insight'
  | 'reset';

export interface AnimationState {
  currentStep: AnimationStep;
  progress: number; // 0-1 for current step
  isClicking: boolean;
  searchText: string;
  activeFilter: string;
  isCardHovered: boolean;
  isMapZoomed: boolean;
  isInsightHighlighted: boolean;
}

export function useAnimationSequence() {
  const [state, setState] = useState<AnimationState>({
    currentStep: 'idle',
    progress: 0,
    isClicking: false,
    searchText: '',
    activeFilter: '',
    isCardHovered: false,
    isMapZoomed: false,
    isInsightHighlighted: false,
  });

  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Start animation
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const loopTime = elapsed % animationSequence.total;

      // Determine current step
      let currentStep: AnimationStep = 'idle';
      let stepProgress = 0;

      if (loopTime >= animationSequence.location.start && loopTime < animationSequence.search.start) {
        currentStep = 'location';
        stepProgress = (loopTime - animationSequence.location.start) / animationSequence.location.duration;
      } else if (loopTime >= animationSequence.search.start && loopTime < animationSequence.filter.start) {
        currentStep = 'search';
        stepProgress = (loopTime - animationSequence.search.start) / animationSequence.search.duration;
      } else if (loopTime >= animationSequence.filter.start && loopTime < animationSequence.result.start) {
        currentStep = 'filter';
        stepProgress = (loopTime - animationSequence.filter.start) / animationSequence.filter.duration;
      } else if (loopTime >= animationSequence.result.start && loopTime < animationSequence.map.start) {
        currentStep = 'result';
        stepProgress = (loopTime - animationSequence.result.start) / animationSequence.result.duration;
      } else if (loopTime >= animationSequence.map.start && loopTime < animationSequence.insight.start) {
        currentStep = 'map';
        stepProgress = (loopTime - animationSequence.map.start) / animationSequence.map.duration;
      } else if (loopTime >= animationSequence.insight.start && loopTime < animationSequence.reset.start) {
        currentStep = 'insight';
        stepProgress = (loopTime - animationSequence.insight.start) / animationSequence.insight.duration;
      } else if (loopTime >= animationSequence.reset.start) {
        currentStep = 'reset';
        stepProgress = (loopTime - animationSequence.reset.start) / animationSequence.reset.duration;
      }

      // Calculate state based on current step
      const newState: AnimationState = {
        currentStep,
        progress: Math.min(stepProgress, 1),
        isClicking: false,
        searchText: '',
        activeFilter: '',
        isCardHovered: false,
        isMapZoomed: false,
        isInsightHighlighted: false,
      };

      // Step-specific states
      switch (currentStep) {
        case 'location':
          newState.isClicking = stepProgress > 0.3 && stepProgress < 0.35;
          break;

        case 'search':
          // Typing animation
          const typingProgress = Math.max(0, stepProgress - 0.2);
          const lettersToShow = Math.floor(typingProgress * 6 * 1.5); // 6 letters in "coffee"
          newState.searchText = 'coffee'.substring(0, Math.min(lettersToShow, 6));
          newState.isClicking = stepProgress > 0.05 && stepProgress < 0.1;
          break;

        case 'filter':
          newState.isClicking = stepProgress > 0.3 && stepProgress < 0.35;
          newState.activeFilter = stepProgress > 0.35 ? 'Trips' : '';
          break;

        case 'result':
          newState.activeFilter = 'Trips';
          newState.isCardHovered = stepProgress > 0.4;
          break;

        case 'map':
          newState.activeFilter = 'Trips';
          newState.isClicking = stepProgress > 0.3 && stepProgress < 0.35;
          newState.isMapZoomed = stepProgress > 0.35;
          break;

        case 'insight':
          newState.activeFilter = 'Trips';
          newState.isMapZoomed = true;
          newState.isInsightHighlighted = stepProgress > 0.2 && stepProgress < 0.8;
          break;

        case 'reset':
          // Fade out everything
          break;

        default:
          break;
      }

      setState(newState);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return state;
}
