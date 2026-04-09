import { RefreshCcw } from 'lucide-react';
import {LoadingProps} from "./Loading.types";
import {cn} from "@/lib/utils"
import styles from "./Loading.module.scss"

export function Loading(props: LoadingProps) {
  const {full} = props;

  return (
      <div className={cn(styles.content, full && styles.fullContent)}>
        <RefreshCcw className={styles.spinner}/>
        <p>Cargando</p>
      </div>
  )
}
