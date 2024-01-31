interface ICargo {

}

let _: {
  counter: number;
  sentFrom: Map<string, number>;
  sentTo: Map<string, number>;
}

export function count(): number {
  return _.counter;
}


export function build() {
  _.counter += 1;

  let __: {
    id: number;
    chain: string[];
    message: string;
    port: string;
  }

  let instance: ICargo = {

  }

  return instance;
}