import { Plus, ShoppingCart } from 'lucide-react'
import QuantitySelector from './QuantitySelector'

export default function AddToCartButton({ product, fullWidth = false }) {
    return (
        <div className={fullWidth ? 'w-full' : ''}>
            <QuantitySelector
                product={product}
                onUpdate={(qty) => {
                    // Force a local update if needed, though QuantitySelector handles most
                }}
            />
        </div>
    )
}
