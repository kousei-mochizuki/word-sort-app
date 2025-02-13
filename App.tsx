import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import "./App.css"

interface Word {
  id: number
  text: string
  originalCluster: number
  currentCluster: number
  displayOrder: number
}

interface Cluster {
  id: number
  words: Word[]
}

const WORDS = [
  "愛国心が強い",
  "愛情深い",
  "遊び心がある",
  "粋",
  "ウィットに富む",
  "影響力が強い",
  "おおらか",
  "おだやか",
  "大人っぽい",
  "お人好し",
  "温和",
  "外向的",
  "賢い",
  "型破り",
  "活発",
  "感覚的",
  "勘が鋭い",
  "感謝の心がある",
  "感傷的",
  "寛容",
  "気さく",
  "几帳面",
  "きちんとしている",
  "奇抜",
  "客観的",
  "共感力が高い",
  "協調性が高い",
  "協力的",
  "規律正しい",
  "勤勉",
  "クリエイティブ",
  "気高い",
  "決断力がある",
  "謙虚",
  "健全",
  "賢明",
  "倹約家",
  "好奇心旺盛",
  "公明正大",
  "効率的",
  "古風",
  "幸せ",
  "自信家",
  "自然派",
  "従順",
  "柔軟",
  "純真",
  "正直",
  "情熱的",
  "上品",
  "如才ない",
  "思慮深い",
  "芯が強い",
  "慎重",
  "スピリチュアル",
  "正義感が強い",
  "責任感が強い",
  "積極的",
  "世話好き",
  "想像豊か",
  "素朴",
  "大胆",
  "知的",
  "注意深い",
  "忠実",
  "哲学的",
  "天才肌",
  "天真爛漫",
  "独立独歩",
  "内向的",
  "情け深い",
  "忍耐強い",
  "熱血",
  "熱心",
  "粘り強い",
  "派手",
  "控えめ",
  "秘密を守る",
  "ひょうきん",
  "太っ腹",
  "プロフェッショナル",
  "分析家",
  "勉強家",
  "冒険好き",
  "奔放",
  "魅力的",
  "面倒見がいい",
  "もてなし上手",
  "優しい",
  "野心家",
  "勇敢",
  "雄弁",
  "誘惑的",
  "用心深い",
  "楽観的",
  "理想家",
  "利他的",
  "臨機応変",
  "礼儀正しい",
  "甘ったれ",
  "荒っぽい",
  "操り上手",
  "いい加減",
  "意気地なし",
  "意地っ張り",
  "意地悪",
  "依存症",
  "いたずら好き",
  "疑い深い",
  "うっとうしい",
  "うぬぼれ屋",
  "恨みがましい",
  "噂好き",
  "大げさ",
  "臆病",
  "男くさい",
  "愚か",
  "恩知らず",
  "がさつ",
  "寡黙",
  "頑固",
  "完璧主義",
  "偽善的",
  "気分屋",
  "気まぐれ",
  "生真面目",
  "気むずかしい",
  "狂信的",
  "協調性が低い",
  "強迫観念が強い",
  "口うるさい",
  "愚直",
  "くどい",
  "激しやすい",
  "けち",
  "強引",
  "傲慢",
  "凝り性",
  "残酷",
  "自己中心的",
  "仕事中毒",
  "知ったかぶり",
  "嫉妬深い",
  "執拗",
  "失礼",
  "支配的",
  "自滅的",
  "邪悪",
  "執念深い",
  "小心者",
  "衝動的",
  "神経過敏",
  "神経質",
  "心配性",
  "せっかち",
  "詮索好き",
  "だまされやすい",
  "知性が低い",
  "注意散漫",
  "挑戦的",
  "つかみどころがない",
  "低俗",
  "手厳しい",
  "独占欲が強い",
  "とげとげしい",
  "貪欲",
  "生意気",
  "怠け者",
  "腹黒い",
  "反抗的",
  "反社会的",
  "被害者意識が強い",
  "悲観的",
  "卑屈",
  "引っ込み思案",
  "皮肉屋",
  "病的",
  "非倫理的",
  "不安症",
  "ふしだら",
  "不正直",
  "不誠実",
  "物質主義",
  "不真面目",
  "不満げ",
  "偏見がある",
  "防衛的",
  "暴力的",
  "見栄っ張り",
  "無気力",
  "向こう見ず",
  "無神経",
  "無責任",
  "無知",
  "無頓着",
  "迷信深い",
  "妄想症",
  "優柔不断",
  "幼稚",
  "抑制的",
  "理不尽",
  "冷淡",
  "浪費家",
  "わがまま",
  "忘れっぽい",
]

const App: React.FC = () => {
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editHistory, setEditHistory] = useState<string[]>([])
  const [missingWords, setMissingWords] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (WORDS.length !== 205) {
      console.error(`Error: WORDS array contains ${WORDS.length} words instead of 205.`)
    }

    const totalWords = clusters.reduce((sum, cluster) => sum + cluster.words.length, 0)
    const missing = WORDS.length - totalWords
    if (missing > 0) {
      const allClusterWords = clusters.flatMap(cluster => cluster.words.map(word => word.text))
      const missingWordDetails = WORDS.filter(word => !allClusterWords.includes(word))
      setMissingWords(missingWordDetails)
    } else {
      setMissingWords([])
    }
  }, [clusters])

  const loadSynsetFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const lines = content.split("\n")
        const newClusters: Cluster[] = lines
          .filter(line => line.trim() !== "") // 空行を無視
          .map((line) => {
            const [id, ...words] = line.split(" ")
            const clusterId = Number.parseInt(id)
            if (isNaN(clusterId) || words.length === 0) return null // NaNのクラスターや空のクラスターを無視
            return {
              id: clusterId,
              words: words.map((word, wordIndex) => ({
                id: clusterId * 1000 + wordIndex,
                text: word,
                originalCluster: clusterId,
                currentCluster: clusterId,
                displayOrder: Math.random(), // ランダムな表示順序を追加
              })),
            }
          })
          .filter(cluster => cluster !== null) as Cluster[] // nullを除外
        setClusters(newClusters)
        setEditHistory([`Loaded file: ${file.name}`])
      }
      reader.readAsText(file)
    }
  }

  const exportSynsetFile = () => {
    const content = clusters
      .map((cluster) => {
        // 元の順序でソートしてから出力
        const sortedWords = [...cluster.words].sort((a, b) => a.id - b.id)
        return `${cluster.id} ${sortedWords.map((word) => word.text).join(" ")}`
      })
      .join("\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "export.synset"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setEditHistory([...editHistory, `Exported file: export.synset`])
  }

  const exportHistoryFile = () => {
    const content = editHistory.join("\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "edit_history.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const addCluster = () => {
    const newId = Math.max(...clusters.map((c) => c.id), 0) + 1
    setClusters([...clusters, { id: newId, words: [] }])
    setEditHistory([...editHistory, `Added cluster ${newId}`])
  }

  const removeCluster = (clusterId: number) => {
    const cluster = clusters.find(c => c.id === clusterId)
    if (cluster && cluster.words.length > 0) {
      alert("Cannot remove a cluster that contains words.")
      return
    }
    setClusters(clusters.filter((c) => c.id !== clusterId))
    setEditHistory([...editHistory, `Removed cluster ${clusterId}`])
  }

  const moveWord = (word: Word, toClusterId: number) => {
    if (word.currentCluster === toClusterId) return

    setClusters((prevClusters) => {
      const updatedClusters = prevClusters.map((cluster) => {
        if (cluster.id === word.currentCluster) {
          return { ...cluster, words: cluster.words.filter((w) => w.id !== word.id) }
        }
        if (cluster.id === toClusterId) {
          return {
            ...cluster,
            words: [...cluster.words, { ...word, currentCluster: toClusterId }],
          }
        }
        return cluster
      })
      return updatedClusters
    })
    setEditHistory((prev) => [
      ...prev,
      `Move word "${word.text}": ${word.currentCluster} ⇒ ${toClusterId}`,
    ])
    setSelectedWord(null)
  }

  const addMissingWordToCluster = (wordText: string, toClusterId: number) => {
    setClusters((prevClusters) => {
      const updatedClusters = prevClusters.map((cluster) => {
        if (cluster.id === toClusterId) {
          const newWord: Word = {
            id: toClusterId * 1000 + cluster.words.length,
            text: wordText,
            originalCluster: toClusterId,
            currentCluster: toClusterId,
            displayOrder: Math.random(),
          }
          return {
            ...cluster,
            words: [...cluster.words, newWord],
          }
        }
        return cluster
      })
      return updatedClusters
    })
    setEditHistory((prev) => [
      ...prev,
      `Added missing word "${wordText}" to cluster ${toClusterId}`,
    ])
    setMissingWords((prev) => prev.filter((word) => word !== wordText))
    setSelectedWord(null)
  }

  const handleWordDoubleClick = (word: Word) => {
    setSelectedWord(word)
  }

  const handleMissingWordDoubleClick = (wordText: string) => {
    setSelectedWord({ id: -1, text: wordText, originalCluster: -1, currentCluster: -1, displayOrder: 0 })
  }

  const handleClusterClick = (clusterId: number) => {
    if (selectedWord) {
      if (selectedWord.id === -1) {
        addMissingWordToCluster(selectedWord.text, clusterId)
      } else {
        moveWord(selectedWord, clusterId)
      }
    }
  }

  // ランダムに並べ替えられた単語のリストを生成
  const sortedClusters = useMemo(() => {
    return clusters.map((cluster) => ({
      ...cluster,
      words: [...cluster.words].sort((a, b) => a.displayOrder - b.displayOrder),
    }))
  }, [clusters])

  return (
    <div className="app">
      <div className="controls">
        <input type="file" accept=".synset" ref={fileInputRef} style={{ display: "none" }} onChange={loadSynsetFile} />
        <button className="openfile-btn" onClick={() => fileInputRef.current?.click()}>ファイルを開く</button>
        <button onClick={exportSynsetFile}>エクスポート</button>
        <button className="addcluster-btn" onClick={addCluster}>+ 新規クラスター</button>
        <input
          type="text"
          placeholder="単語を検索…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setShowHistory(!showHistory)}>{showHistory ? "Hide History" : "Show History"}</button>
      </div>
      <div className="main-content">
        <div className="clusters">
          {sortedClusters.map((cluster) => (
            <div key={cluster.id} className="cluster" onClick={() => handleClusterClick(cluster.id)}>
              <h3>
                Cluster {cluster.id}{" "}
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeCluster(cluster.id)
                  }}
                >
                  ✕
                </button>
              </h3>
              <div className="words">
                {cluster.words.map((word) => (
                  <div
                    key={word.id}
                    className={`word ${word.currentCluster !== word.originalCluster ? "moved" : ""} ${
                      searchTerm && word.text.includes(searchTerm) ? "highlighted" : ""
                    } ${selectedWord?.id === word.id ? "selected" : ""}`}
                    onDoubleClick={() => handleWordDoubleClick(word)}
                  >
                    {word.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {showHistory && (
          <div className="sidebar">
            <button onClick={exportHistoryFile}>Export History</button>
            <h3>編集履歴</h3>
            <div>
              {editHistory.map((edit, index) => (
                <div key={index}>{edit}</div>
              ))}
            </div>
            <h3>不足している単語</h3>
            <div className="words">
              {missingWords.map((word, index) => (
                <div
                  key={index}
                  className={`word missing-word ${selectedWord?.text === word ? "selected" : ""}`}
                  onDoubleClick={() => handleMissingWordDoubleClick(word)}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
