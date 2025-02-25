import { v4 as uuidv4 } from "uuid";

export type Particle = {
  id: string;
  display: string;
  endAt: number;
};

export default function useParticles() {
  const particles = ref<Particle[]>([]);

  /**
   * Create a new particle
   * @param display value to show
   * @param duration life span in milliseconds
   */
  function summon(display: string, duration: number): void {
    const id = uuidv4();

    particles.value.push({
      id,
      display,
      endAt: Date.now() + duration,
    });

    setTimeout(() => {
      remove(id);
    }, duration);
  }

  /**
   * Remove a particle by id
   * @param id particle id
   */
  function remove(id: string): void {
    particles.value = particles.value.filter((p) => p.id !== id);
  }

  function clear() {
    particles.value = [];
  }

  return {
    entities: particles,
    summon,
    remove,
    clear,
  };
}
