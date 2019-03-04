import { Machine, StateSchema, assign } from 'xstate';

const lazyLoadMachine = Machine({
  id: "lazy-load",
  initial: "idle",
  states: {
    idle: {
      on: { TURNED_VISIBLE: "visible" }
    },
    visible: {
      after: {
        2500: 'loading' 
      },
      on: {
        TURNED_HIDDEN: 'hidden'
      }
    },
    hidden: {
      on: { TURNED_VISIBLE: "visible" }
    },
    loading: {
      onEntry: 'load'
    }
  }
});

//////////

const lazyLoadMachine = Machine({
  id: "lazy-load",
  initial: "idle",
  context: {
    dataId: 42,
    user: undefined,
    error: undefined
  },
  states: {
    idle: {
      on: { TURNED_VISIBLE: "visible" }
    },
    visible: {
      after: {
        2500: 'loading' 
      },
      on: {
        TURNED_HIDDEN: 'hidden'
      }
    },
    hidden: {
      on: { TURNED_VISIBLE: "visible" }
    },
    loading: {
      invoke: {
        id: 'getData',
        src: 'fetchData',
        onDone: {
          target: 'success',
          actions: 'updateUser'
        },
        onError: {
          target: 'failure',
          actions: 'updateError'
        }
      }
    },
    success: {},
    failure: {
      on: {
        RETRY: 'loading'
      }
    }
  }
});
