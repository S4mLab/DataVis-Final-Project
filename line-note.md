# Generator

A generator is a func that can generate a path

# .data() vs datum()

`.data()` is perfect for joining multiple of data with multiple elements

However, in a case that you need to join one piece of data with one element, `.datum()` can help you do just that

The line is a continuos path, it might look like a multiple lines combine together, but it will be a single element in our document
Since we have one element, we need to join an entire dataset to it > posible with `datum` func

`d3.pointer(event[, target])` returns a 2-elements array of numbers [x, y] representing the coordinates of the specified event relative to the specified target

the 2nd arg - `target`, is helpful because d3 return the coordinates relative to the target element we pass in

the [x,y] coordinate, the coordinates are relative to the container, not the svg image nor the document, that's why you receive coordinate values close to 0, keep in mind, the line is draw inside the container, the container is smaller than the svg image

# Bisector

A bisector is a func that helps us locate where to insert an element into an array to maintain a sorted array

we only know the x, y position of the mouse, we will use a bisector to figure out where to display the tooltip

```javascript

```

```javascript
const nums = [10, 20, 30, 40, 50]
nums.push(35)
// new array = [10, 20, 30, 40, 50, 35] > unsorted
```

but what if you want to sort the order of the array so that 35 between 30 and 40?
u can use `sort()` and it works fine but there is another solution, adding an item directly into the array using index, `splice()` can help you do that
but u need to give `splice` the index you want the value you want to be in, that where `bisect()` come in

`bisect` meaning: divided into 2 parts

```javascript
const nums = [10, 20, 30, 40, 50]
const index = d3.bisect(nums, 35) // return 3

nums.splice(index, 0, 35)
// new array = [10,20,30,35,40,50]
```

## splice()

this method removes/adds items from/to an array, and returns the removed item(s)

Note: this method changes the original array

```javascript
// Syntax
array.splice(index, howmany, item1, ..., itemX)
```

_index_: required
_howmany_: optional, the number of items to be removed. If set to 0, no item will be removed
_item1,...itemX_: optional, new items to be added to the array

## d3.bisector()

Used to return a new bisector using the specified accessor function
This method can be used to bisect arrays of objs instead of being limited to simple arrays of primitives

`d3.bisector(accessor)`

```javascript
const bisectDate = d3.bisector(xValue)
```

the return value of this function will be an object with 3 properties - left, center, right
And the values of all 3 properties are functions

it's possible for the `bisect` function to find multiple locations to insert the date.
D3 provides us with 3 options for deciding where to insert the date, you can choose:

- left: the lowest possible index
- center: choose the index in the middle
- right: the highest possible index

the cunstom bisector function has the same args as the bisec function

# d3.extent()

`d3.extent(iterable[, accessor])`

return the min and max value in the given iterable using natural order. if the iterable contains no comparable values, return `[undefined, undefined]`

An optional accessor function may be specified
