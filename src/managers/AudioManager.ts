export interface AudioManagerNodesMap {
  [key: string]: AudioNode;
  panner: StereoPannerNode;
  gain: GainNode;
  destination: AudioDestinationNode;
}

export class AudioManager {
  private audioContext!: AudioContext

  private nodesMap!: AudioManagerNodesMap

  public get context() {
    return this.audioContext
  }

  private get nodes(): AudioNode[] {
    return Object.values(this.nodesMap)
  }

  public init(nodesMap?: Record<string, AudioNode>) {
    this.audioContext = new AudioContext()
    this.initNodes(nodesMap)
  }

  public shutdown() {
    this.audioContext.close()
  }

  public mute() {
    this.nodesMap.gain.gain.setValueAtTime(0, 0)
  }

  public pause() {
    this.context.suspend()
  }

  public resume() {
    this.context.resume()
  }

  public connectMediaSource(src: string | HTMLMediaElement): HTMLMediaElement {
    const mediaElem: HTMLMediaElement = typeof src === 'string' ? new Audio(src) : src
    const track = this.context.createMediaElementSource(mediaElem)
    this.connectNode(track)
    return track.mediaElement
  }

  public async connectBufferSource(src: string | AudioBuffer): Promise<AudioBufferSourceNode> {
    const buffer: AudioBuffer = src instanceof AudioBuffer ? src : await this.fetchAudioBuffer(src)
    const track = this.context.createBufferSource()
    track.buffer = buffer
    this.connectNode(track)
    return track
  }

  private initNodes(nodesMap: Record<string, AudioNode> = {}) {
    this.nodesMap = {
      ...nodesMap,
      panner: this.context.createStereoPanner(),
      gain: this.context.createGain(),
      destination: this.context.destination,
    }
    this.nodes.forEach((node, index, nodes) => {
      if (index + 1 < nodes.length) {
        node.connect(nodes[index + 1])
      }
    })
  }

  private connectNode(nodeToConnect: AudioNode): AudioNode {
    let connectedNode = nodeToConnect
    this.nodes.forEach(node => connectedNode = connectedNode.connect(node))
    return connectedNode
  }

  private async fetchAudioBuffer(src: string): Promise<AudioBuffer> {
    const resp = await fetch(src)
    const arrayBuffer = await resp.arrayBuffer()
    return this.context.decodeAudioData(arrayBuffer)
  }
}
