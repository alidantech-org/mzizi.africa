import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/frontend/message.dart';

part 'copy_bundle.g.dart';

/// Copy Bundle
@JsonSerializable(includeIfNull: false)
class FrontendCopyBundle {
  const FrontendCopyBundle({required this.language, required this.messages});
  final String language;
  final List<FrontendMessage> messages;

  factory FrontendCopyBundle.fromJson(Map<String, dynamic> json) => _$FrontendCopyBundleFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendCopyBundleToJson(this);
}
