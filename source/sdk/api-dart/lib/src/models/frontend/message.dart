import 'package:json_annotation/json_annotation.dart';

part 'message.g.dart';

/// Message
@JsonSerializable(includeIfNull: false)
class FrontendMessage {
  const FrontendMessage({required this.key, required this.text});
  final String key;
  final String text;

  factory FrontendMessage.fromJson(Map<String, dynamic> json) => _$FrontendMessageFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendMessageToJson(this);
}
