import { WitnessTester } from "circomkit";
import { circomkit } from "./common";
import crypto from "crypto";

describe("Sha256Var", () => {
  let circuit: WitnessTester<["in", "len"], ["out"]>;

  describe("Sha256Var", () => {
    let blocks;
    //todo add more tests
    it("Should generate input for 120-183 len (3 blocks)", async () => {
      blocks = 3;
      circuit = await circomkit.WitnessTester(`Sha256Var`, {
        file: "sha256Var",
        template: "Sha256Var",
        params: [blocks],
      });
      for (let i = 120; i < 183; i++) {
        const message = Array(183).fill("a").join("");
        const lenInBits = message.length * 8;
        const input = msgToBits(message, 2 << blocks);
        const msgHash = crypto.createHash("sha256").update(message).digest("hex");

        await circuit.expectPass(
          {
            in: input,
            len: lenInBits,
          },
          { out: bufferToBitArray(Buffer.from(msgHash, "hex")) }
        );
      }
    });
  });
});

function msgToBits(msg: string, blocks: number) {
  let inn = bufferToBitArray(Buffer.from(msg));
  const overall_len = blocks * 512;
  const add_bits = overall_len - inn.length;
  inn = inn.concat(Array(add_bits).fill(0));
  return inn;
}

function bufferToBitArray(b: Buffer) {
  const res = [];
  for (let i = 0; i < b.length; i++) {
    for (let j = 0; j < 8; j++) {
      res.push((b[i] >> (7 - j)) & 1);
    }
  }
  return res;
}
