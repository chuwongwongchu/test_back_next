import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};


export async function OPTIONS(req) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db('todolist');
    const todos = await db.collection('todos').find({}).toArray();

    return new Response(JSON.stringify(todos), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching todos:', error.message);
    return new Response(JSON.stringify({ message: 'Error fetching todos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db('todolist');
    const { text } = await req.json();
    if (!text) {
      return new Response(JSON.stringify({ message: 'Text is required' }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }
    const newTodo = { text };
    await db.collection('todos').insertOne(newTodo);

    return new Response(JSON.stringify(newTodo), {
      status: 201,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error adding todo:', error);
    return new Response(JSON.stringify({ message: 'Error adding todo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db('todolist');
    const { id } = req.query; 

    if (!id) {
      return new Response(JSON.stringify({ message: 'ID is required' }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ message: 'Todo not found' }), {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Todo deleted successfully' }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return new Response(JSON.stringify({ message: 'Error deleting todo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req) {
  try {
    const client = await clientPromise;
    const db = client.db('todolist');
    const { id } = req.query; 
    const { text } = await req.json();

    if (!id || !text) {
      return new Response(JSON.stringify({ message: 'ID and text are required' }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    const result = await db.collection('todos').updateOne(
      { _id: new ObjectId(id) },
      { $set: { text } }
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ message: 'Todo not found or no changes made' }), {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Todo updated successfully' }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    return new Response(JSON.stringify({ message: 'Error updating todo' }), {
      status: 500,
      headers: { ...corsHeaders,'Content-Type': 'application/json' },
    });
  }
}



