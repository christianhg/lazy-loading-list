import { Machine, StateSchema, interpret } from 'xstate';
import { Interpreter } from 'xstate/lib/interpreter';

interface LazyLoadSchema extends StateSchema {
  states: {
    idle: {};
    visible: {};
    hidden: {};
    loading: {};
  };
}

type LazyLoadEvent = { type: 'TURNED_VISIBLE' } | { type: 'TURNED_HIDDEN' };

interface LazyLoadMachineConfig {
  onLoading: () => void;
}

export type LazyLoadMachine = Interpreter<
  undefined,
  LazyLoadSchema,
  LazyLoadEvent
>;

export function createLazyLoadMachine({
  onLoading,
}: LazyLoadMachineConfig): LazyLoadMachine {
  const machine = Machine<undefined, LazyLoadSchema, LazyLoadEvent>(
    {
      id: 'lazy-load',
      initial: 'idle',
      states: {
        idle: {
          on: { TURNED_VISIBLE: 'visible' },
        },
        visible: {
          after: {
            250: 'loading',
          },
          on: {
            TURNED_HIDDEN: 'hidden',
          },
        },
        hidden: {
          on: { TURNED_VISIBLE: 'visible' },
        },
        loading: {
          onEntry: 'notifyLoading',
        },
      },
    },
    {
      actions: {
        notifyLoading: onLoading,
      },
    },
  );

  const interpreter = interpret(machine).start();

  return interpreter;
}

//////////

interface AdvancedLazyLoadSchema extends StateSchema {
  states: {
    idle: {};
    visible: {};
    hidden: {};
    loading: {};
    success: {};
    failure: {};
  };
}

interface AdvancedLazyLoadMachineContext<T> {
  id: number;
  data: T | undefined;
  error: string | undefined;
}

interface AdvancedLazyLoadMachineConfig<T> {
  id: number;
  fetchData: (id: number) => Promise<T>;
  onDone: () => void;
  onError: (error: string) => void;
}

type AdvancedLazyLoadEvent =
  | { type: 'TURNED_VISIBLE' }
  | { type: 'TURNED_HIDDEN' }
  | { type: 'RETRY' };

export type AdvancedLazyLoadMachine<T> = Interpreter<
  AdvancedLazyLoadMachineContext<T>,
  AdvancedLazyLoadSchema,
  AdvancedLazyLoadEvent
>;

export function createAdvancedLazyLoadMachine<T>({
  id,
  fetchData,
  onDone,
  onError,
}: AdvancedLazyLoadMachineConfig<T>): AdvancedLazyLoadMachine<T> {
  const machine = Machine<
    AdvancedLazyLoadMachineContext<T>,
    AdvancedLazyLoadSchema,
    AdvancedLazyLoadEvent
  >(
    {
      id: 'lazy-load',
      initial: 'idle',
      context: {
        id,
        data: undefined,
        error: undefined,
      },
      states: {
        idle: {
          on: { TURNED_VISIBLE: 'visible' },
        },
        visible: {
          after: {
            250: 'loading',
          },
          on: {
            TURNED_HIDDEN: 'hidden',
          },
        },
        hidden: {
          on: { TURNED_VISIBLE: 'visible' },
        },
        loading: {
          invoke: {
            id: 'getData',
            src: 'fetchData',
            onDone: {
              target: 'success',
              actions: 'notifyDone',
            },
            onError: {
              target: 'failure',
              actions: 'notifyError',
            },
          },
        },
        success: {},
        failure: {
          on: {
            RETRY: 'loading',
          },
        },
      },
    },
    {
      actions: {
        fetchData: ctx => fetchData(ctx.id),
        notifyDone: onDone,
        notifyError: ctx => {
          if (ctx.error) {
            onError(ctx.error);
          }
        },
      },
    },
  );

  const interpreter = interpret(machine).start();

  return interpreter;
}
