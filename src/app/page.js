import Image from "next/image";
import styles from "./page.module.css";
import DropDownItem from "./components/DropDownItem";

// const items = [
//   'Hakalau',
//   'Vivation',
//   'Kriya Yoga',
//   'Yoga Nidra',
//   'Art of Accomplishment'
// ];


const items = [
  { title: 'Hakalau', markdownFile: 'hakalau.md'},
  { title: 'Vivation', markdownFile: 'vivation.md'},
  { title: 'Kriya Yoga', markdownFile: 'kriya_yoga.md'},
]

const text = [
  'Hakalau is a Hawaian Meditative Practice',
  'Vivation is a Circular Breathing Practice',
  'Kriya Yoga is a Yogic Practice',
  'Yoga Nidra is a way to relax your nervous system',
  'Art of Accomplishment is a community and body of work'
]



export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '600px', height: '800px', boxSizing: 'border-box', margin: '0 auto', padding: '20px'}}>
      {items.map((item, index) => (
        <DropDownItem key={index} title={item.title} markdownFile={item.markdownFile} />
      ))}
    </div>
    </div>
  )
}
