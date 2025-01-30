import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import "./App.css"

interface Word {
  id: number
  text: string
  originalCluster: number
  currentCluster: number
  displayOrder: number // 新しいプロパティ
}

interface Cluster {
  id: number
  words: Word[]
}

const WORDS = [
  "不安症",
  "内向的",
  "冷淡",
  "寡黙",
  "悲観的",
  "控えめ",
  "神経質",
  "臆病",
  "自滅的",
  "大胆",
  "天才肌",
  "派手",
  "野心家",
  "くどい",
  "わがまま",
  "向こう見ず",
  "手助け",
  "抑制的",
  "規律正しい",
  "賢明",
  "うぬぼれ屋",
  "おおらか",
  "つかみどころがない",
  "ふしだら",
  "スピリチュアル",
  "不真面目",
  "不誠実",
  "健全",
  "優柔不断",
  "共感力が高い",
  "勘が鋭い",
  "奇抜",
  "奔放",
  "小心者",
  "幼稚",
  "愚直",
  "感傷的",
  "気分屋",
  "知ったかぶり",
  "純真",
  "腹黒い",
  "臨機応変",
  "衝動的",
  "見栄っ張り",
  "幸せ",
  "楽観的",
  "おだやか",
  "きちんとしている",
  "傲慢",
  "公明正大",
  "勤勉",
  "協調性が高い",
  "執念深い",
  "大人っぽい",
  "寛容",
  "従順",
  "忠実",
  "情け深い",
  "正直",
  "気高い",
  "熱心",
  "生意気",
  "生真面目",
  "知的",
  "積極的",
  "粋",
  "素朴",
  "自信家",
  "芯が強い",
  "責任感が強い",
  "面倒見がいい",
  "魅力的",
  "お人好し",
  "もてなし上手",
  "優しい",
  "外向的",
  "気さく",
  "温和",
  "礼儀正しい",
  "謙虚",
  "好奇心旺盛",
  "勇敢",
  "愛国心が強い",
  "手厳しい",
  "挑戦的",
  "粘り強い",
  "頑固",
  "分析家",
  "影響力が強い",
  "思慮深い",
  "柔軟",
  "正義感が強い",
  "決断力がある",
  "注意深い",
  "心配性",
  "慎重",
  "用心深い",
  "疑い深い",
  "いたずら好き",
  "冒険好き",
  "情熱的",
  "活発",
  "熱血",
  "せっかち",
  "とげとげしい",
  "偽善的",
  "几帳面",
  "反抗的",
  "天真爛漫",
  "失礼",
  "如才ない",
  "怠け者",
  "恨みがましい",
  "意地っ張り",
  "支配的",
  "暴力的",
  "残酷",
  "気まぐれ",
  "気むずかしい",
  "注意散漫",
  "激しやすい",
  "無気力",
  "無神経",
  "狂信的",
  "病的",
  "皮肉屋",
  "荒っぽい",
  "邪悪",
  "プロフェッショナル",
  "凝り性",
  "理想家",
  "反社会的",
  "だまされやすい",
  "いい加減",
  "引っ込み思案",
  "忘れっぽい",
  "愚か",
  "無頓着",
  "知性が低い",
  "賢い",
  "遊び心がある",
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
      setMissingWords([`${missing} words are missing`])
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
        const newClusters: Cluster[] = lines.map((line) => {
          const [id, ...words] = line.split(" ")
          const clusterId = Number.parseInt(id)
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

  const addCluster = () => {
    const newId = Math.max(...clusters.map((c) => c.id), 0) + 1
    setClusters([...clusters, { id: newId, words: [] }])
    setEditHistory([...editHistory, `Added cluster ${newId}`])
  }

  const removeCluster = (clusterId: number) => {
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
      setEditHistory((prev) => [
        ...prev,
        `Moved word "${word.text}" from cluster ${word.currentCluster} to ${toClusterId}`,
      ])
      return updatedClusters
    })
    setSelectedWord(null)
  }

  const handleWordDoubleClick = (word: Word) => {
    setSelectedWord(word)
  }

  const handleClusterClick = (clusterId: number) => {
    if (selectedWord) {
      moveWord(selectedWord, clusterId)
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
        <button onClick={() => fileInputRef.current?.click()}>Load .synset file</button>
        <button onClick={exportSynsetFile}>Export .synset file</button>
        <button onClick={addCluster}>Add Cluster</button>
        <input
          type="text"
          placeholder="Search words"
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
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeCluster(cluster.id)
                  }}
                >
                  Remove
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
            <h3>Edit History</h3>
            <ul>
              {editHistory.map((edit, index) => (
                <li key={index}>{edit}</li>
              ))}
            </ul>
            <h3>Missing Words</h3>
            <ul>
              {missingWords.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
