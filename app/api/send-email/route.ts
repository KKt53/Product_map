// import { type NextRequest, NextResponse } from "next/server"
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request: NextRequest) {
//   try {
//     const { storeName, status, description, photoCount } = await request.json()

//     // 実際のメール送信サービス（例：Resend、SendGrid等）を使用する場合は、
//     // ここでメール送信のロジックを実装します

//     // 3. 送信先と送信元アドレスを定義
//     const recipientEmail = "kota.kamon-2024@outlook.jp";

//     // 送信元アドレスは環境変数から取得（認証済みのもの）
//     const senderEmail = process.env.VERIFIED_SENDER_EMAIL;

//     if (!senderEmail) {
//         throw new Error("送信元メールアドレス(VERIFIED_SENDER_EMAIL)が設定されていません。");
//     }
    
//     // 4. Resend APIを呼び出し、メールを送信
//     const { data, error } = await resend.emails.send({
//       from: senderEmail, // 認証済みの送信元アドレス
//       to: [recipientEmail], // 宛先アドレス
//       subject: '【新規店舗投稿】' + storeName, // 件名
//       html: `
//         <h1>新規店舗投稿のお知らせ</h1>
//         <p>以下の内容で新しい店舗情報が投稿されました。</p>
//         <hr>
//         <ul>
//           <li><strong>店舗名:</strong> ${storeName}</li>
//           <li><strong>状態:</strong> ${status}</li>
//           <li><strong>説明:</strong> ${description.replace(/\n/g, '<br>')}</li>
//           <li><strong>写真数:</strong> ${photoCount}枚</li>
//         </ul>
//         <hr>
//         <p>確認をお願いいたします。</p>
//       `,
//     });

//     if (error) {
//       console.error("Resend API エラー:", error);
//       // Resendからのエラーをキャッチブロックに渡す
//       throw new Error(error.message); 
//     }

//     // 成功ログ（デバッグ用）
//     console.log("メール送信成功:", data);

//     // デモ用のログ出力
//     console.log("メール送信内容:")
//     console.log("宛先: kota.kamon-2024@outlook.jp")
//     console.log("件名: 新規店舗投稿")
//     console.log("内容:")
//     console.log(`店舗名: ${storeName}`)
//     console.log(`状態: ${status}`)
//     console.log(`説明: ${description}`)
//     console.log(`写真数: ${photoCount}枚`)

//     // メール送信のシミュレーション
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("メール送信エラー:", error)
//     return NextResponse.json({ error: "メール送信に失敗しました" }, { status: 500 })
//   }
// }
