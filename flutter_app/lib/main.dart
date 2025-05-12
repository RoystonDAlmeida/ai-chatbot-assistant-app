
import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http; // Uncomment for API calls
// import 'dart:convert'; // Uncomment for API calls

void main() {
  runApp(const MyApp());  // inflates the widget 'MyApp' and attaches it to the screen
}

// Stateless widget - MyApp
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Assist Flutter',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const MyHomePage(),
    );
  }
}

// Stateful widget - MyHomePage, changes states with _MyHomePageState widget
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final TextEditingController _controller = TextEditingController();  // Manages the text input field, where user types their messages
  final List<Message> _messages = []; // List of messages(Chat history)
  bool _isLoading = false;  // Boolean variable to track loading state from AI response 

  // Dummy API call function - replace with actual backend integration
  // Future<String> _sendMessageToApi(String text) async {
  //   // Simulate network delay
  //   await Future.delayed(const Duration(seconds: 1));
  //   // Example: Call your Genkit backend.
  //   // final response = await http.post(
  //   //   Uri.parse('YOUR_BACKEND_API_ENDPOINT'),
  //   //   headers: <String, String>{
  //   //     'Content-Type': 'application/json; charset=UTF-8',
  //   //   },
  //   //   body: jsonEncode(<String, String>{
  //   //     'userInput': text,
  //   //     // Include conversation history if needed
  //   //   }),
  //   // );
  //   // if (response.statusCode == 200) {
  //   //   return jsonDecode(response.body)['aiResponse'];
  //   // } else {
  //   //   throw Exception('Failed to load response from AI');
  //   // }
  //   return "AI: You said '$text'";
  // }

  void _handleSendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add(Message(text: text, sender: Sender.user, timestamp: DateTime.now()));
      _isLoading = true; // Show loading indicator for AI response
    });
    _controller.clear();

    try {
      // Simulate AI response
      await Future.delayed(const Duration(milliseconds: 800));
      final aiResponseText = "AI: I processed '${text}'. How can I help further?";
      // final aiResponseText = await _sendMessageToApi(text); // Uncomment for real API call
      setState(() {
        _messages.add(Message(text: aiResponseText, sender: Sender.ai, timestamp: DateTime.now()));
      });
    } catch (e) {
      setState(() {
        _messages.add(Message(text: "Error: Could not get AI response.", sender: Sender.ai, timestamp: DateTime.now()));
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(  // Scaffold - provides a standard mobile app layout structure
      appBar: AppBar(
        title: const Text('AI Assist (Flutter)'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(8.0),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                return ChatBubble(message: message);
              },
            ),
          ),
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8.0),
              child: LinearProgressIndicator(),
            ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: <Widget>[
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Type your message...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20.0),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
                    ),
                    onSubmitted: (_) => _handleSendMessage(),
                    enabled: !_isLoading,
                  ),
                ),
                const SizedBox(width: 8.0),
                IconButton.filled(
                  icon: const Icon(Icons.send),
                  onPressed: _isLoading ? null : _handleSendMessage,
                  style: IconButton.styleFrom(
                    padding: const EdgeInsets.all(12.0),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

enum Sender { user, ai }

class Message {
  final String text;
  final Sender sender;
  final DateTime timestamp;

  Message({required this.text, required this.sender, required this.timestamp});
}

class ChatBubble extends StatelessWidget {
  final Message message;

  const ChatBubble({super.key, required this.message});

  @override
  Widget build(BuildContext context) {
    final bool isUser = message.sender == Sender.user;
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4.0, horizontal: 8.0),
        padding: const EdgeInsets.all(12.0),
        decoration: BoxDecoration(
          color: isUser ? Theme.of(context).colorScheme.primaryContainer : Theme.of(context).colorScheme.secondaryContainer,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16.0),
            topRight: const Radius.circular(16.0),
            bottomLeft: isUser ? const Radius.circular(16.0) : const Radius.circular(0),
            bottomRight: isUser ? const Radius.circular(0) : const Radius.circular(16.0),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.3),
              spreadRadius: 1,
              blurRadius: 3,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Text(
              message.text,
              style: TextStyle(color: isUser ? Theme.of(context).colorScheme.onPrimaryContainer : Theme.of(context).colorScheme.onSecondaryContainer),
            ),
            const SizedBox(height: 4.0),
            Text(
              '${message.timestamp.hour}:${message.timestamp.minute.toString().padLeft(2, '0')}',
              style: TextStyle(
                fontSize: 10.0,
                color: (isUser ? Theme.of(context).colorScheme.onPrimaryContainer : Theme.of(context).colorScheme.onSecondaryContainer).withOpacity(0.7),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
