import React from 'react'
import { useState } from 'react' // подключение хука состояния useState

 interface Service {
 id: number
 name: string
 price: number
 }

 interface ServiceItem {
 service: Service
 quantity: number
 }

 const availableServices: Service[] = [
 { id: 1, name: 'Разработка лендинга', price: 50000 },
 { id: 2, name: 'Интернет-магазин', price: 150000 },
 { id: 3, name: 'Корпоративный портал', price: 300000 },
 { id: 4, name: 'SEO-оптимизация', price: 20000 },
 ]

 export default function ProjectBuilder() {
    /**
     * Объявление переменных selectedServices и selectedServiceId через хук состояния useState.
     * Это необходимо, чтобы при изменении значений этих переменных вызывать повторный рендер для отображения в окне браузера.
     * В этом, собственно, и была основная ошибка кода.
     */
    const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([])
    const [selectedServiceId, setSelectedServiceId] = useState<number|string>('')
    let [quantity, setQuantity] = useState<number>(1)

    let totalPrice: number = 0
    for (const item of selectedServices) {
    totalPrice += item.service.price * item.quantity
    }

    function addService() {
        /**
         * Добавлено явное указание типа для service
         */
        const service: Service|undefined = availableServices.find(s => s.id === selectedServiceId)
        if (!service) return (<div>Список услуг пуст</div>)
        /**
         * Добавлено явное указание типа для existing
         */
        const existing: ServiceItem|undefined = selectedServices.find(item => item.service === service)
        if (existing) {
        existing.quantity += quantity
        } else {
        /**
         * добавление элемента в массив setSelectedServices через функцию хука состояния
         */
        setSelectedServices([...selectedServices, {service, quantity}])
        }
    }

    function removeService(item: ServiceItem) {
        /**
         * Добавлено явное указание типа для index
         */
        const index: number|undefined = selectedServices.indexOf(item)
        if (index > -1) {
            /**
             * Удаление элемента из массива selectedServices через функцию хука состояния
             */
            const arr: ServiceItem[] = [...selectedServices]
            arr.splice(index, 1)
            setSelectedServices(arr)
        }
    }

    return (
    <div className="project-builder" style={{ maxWidth: 700, margin: '0 auto', fontFamily: 'sans-serif' }}>
    <h2>Состав проекта</h2>

    <div className="add-service" style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
    <select
    value={selectedServiceId}
    /**
     * Выбор элемента в выпадающем списке через функцию хука состояния
     */
    onChange={e => { setSelectedServiceId(Number(e.target.value)) }}
    >
    <option value="" disabled>Выберите услугу</option>
    {availableServices.map(service => (
    <option key={service.id} value={service.id}>
    {service.name} — {service.price.toLocaleString()} ₽
    </option>
    ))}
    </select>

    <input
    type="number"
    min={1}
    max={10}
    value={quantity}
    /**
     * Измненеие значение количества через функцию хука состояния
     */
    onChange={e => { setQuantity(Number(e.target.value)) }}
    style={{ width: 80, padding: '8px 12px' }}
    />

    <button onClick={addService} disabled={!selectedServiceId}>
    Добавить
    </button>
    </div>

    {selectedServices.length > 0 ? (
    <table className="services-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
    <tr>
    <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Услуга</th>
    <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Цена за ед.</th>
    <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Кол-во</th>
    <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Сумма</th>
    <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}></th>
    </tr>
    </thead>
    <tbody>
    {selectedServices.map(item => (
    <tr key={item.service.id}>
    <td style={{ border: '1px solid #ddd', padding: 10 }}>{item.service.name}</td>
    <td style={{ border: '1px solid #ddd', padding: 10 }}>{item.service.price.toLocaleString()} ₽</td>
    <td style={{ border: '1px solid #ddd', padding: 10 }}>{item.quantity}</td>
    <td style={{ border: '1px solid #ddd', padding: 10 }}>
    {(item.service.price * item.quantity).toLocaleString()} ₽
    </td>
    <td style={{ border: '1px solid #ddd', padding: 10 }}>
    <button onClick={() => removeService(item)}>Удалить</button>
    </td>
    </tr>
    ))}
    </tbody>
    <tfoot>
    <tr>
    <td colSpan={3} style={{ border: '1px solid #ddd', padding: 10 }}>
    <strong>Итого:</strong>
    </td>
    <td colSpan={2} style={{ border: '1px solid #ddd', padding: 10 }}>
    <strong>{totalPrice.toLocaleString()} ₽</strong>
    </td>
    </tr>
    </tfoot>
    </table>
    ) : (
    <p style={{ color: '#888', fontStyle: 'italic' }}>Пока не добавлено ни одной услуги</p>
    )}
    </div>
    )
 }