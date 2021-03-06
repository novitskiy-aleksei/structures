<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@webcobra/structures](./structures.md) &gt; [LinkedListItem](./structures.linkedlistitem.md)

## LinkedListItem class

Wraps linked list item with various information about siblings

<b>Signature:</b>

```typescript
export declare abstract class LinkedListItem<ListId, ListValue extends LinkedListValue<ListId>> 
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(value, prev, next)](./structures.linkedlistitem._constructor_.md) |  | Constructs a new instance of the <code>LinkedListItem</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [id](./structures.linkedlistitem.id.md) |  | ListId | Item identifier |
|  [next](./structures.linkedlistitem.next.md) |  | this \| null \| undefined | Pointer to next list item<!-- -->null - no loaded next items undefined - this item is list last element, no loading required |
|  [prev](./structures.linkedlistitem.prev.md) |  | this \| null \| undefined | Pointer to previous list item<!-- -->null - no loaded previous items undefined - this item is list starting element |
|  [value](./structures.linkedlistitem.value.md) |  | ListValue | Original list item value which was wrapped |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [copy()](./structures.linkedlistitem.copy.md) |  | Makes a one level copy of current item. Used in insert methods to not break input immutability |
|  [headDistance()](./structures.linkedlistitem.headdistance.md) |  | Calculates element amount left to list begin |
|  [log()](./structures.linkedlistitem.log.md) |  | Make string representation of this item for debugging purposes |
|  [markAsBegin()](./structures.linkedlistitem.markasbegin.md) |  | Marks this element as global list begin |
|  [markAsEnd()](./structures.linkedlistitem.markasend.md) |  | Marks this element as global list ending |
|  [tailDistance()](./structures.linkedlistitem.taildistance.md) |  | Calculates element amount left to list ending |

