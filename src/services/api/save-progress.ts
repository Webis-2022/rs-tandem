import { supabase } from '../supabaseClient';
export async function saveProgress() {
  const topic = document.querySelector('.topic');
  const time = document.querySelector('.time');
  const score = document.querySelector('.score');

  await supabase.from('game_results').insert({
    //ADD user.id
    user_id: '550e8400-e29b-41d4-a716-446655440088',
    topic: topic?.textContent,
    time: time?.textContent,
    score: score?.textContent,
  });
}
