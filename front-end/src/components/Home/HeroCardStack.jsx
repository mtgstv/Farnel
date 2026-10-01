import alimentos1 from '../../assets/alimentos1.jpg'
import alimentos2 from '../../assets/alimentos2.jpg'
import alimentos3 from '../../assets/alimentos3.jpg'
import alimentos4 from '../../assets/alimentos4.jpg'
import PilhaDeCartas from '../Comuns/PilhaDeCartas'

const cards = [
    { src: alimentos1, alt: 'Caixas com batatas amarelas e roxas' },
    { src: alimentos2, alt: 'Cabeças de alho frescas' },
    { src: alimentos3, alt: 'Nozes sobre um tecido de juta' },
    { src: alimentos4, alt: 'Laranjas maduras' },
]

// Carrossel de fotos da home pública.
export default function HeroCardStack() {
    return (
        <PilhaDeCartas
            itens={cards}
            getKey={(card) => card.src}
            renderCarta={(card) => (
                <img
                    src={card.src}
                    alt={card.alt}
                    className="h-full w-full object-cover"
                />
            )}
        />
    )
}
