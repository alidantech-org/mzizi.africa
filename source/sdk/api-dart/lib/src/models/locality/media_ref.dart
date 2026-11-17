import 'package:json_annotation/json_annotation.dart';

part 'media_ref.g.dart';

/// Media Ref
@JsonSerializable(includeIfNull: false)
class LocalityMediaRef {
  const LocalityMediaRef({required this.fileVersionId, required this.kind, this.mimeType, this.title, this.url});
  final String fileVersionId;
  final String kind;
  final String? mimeType;
  final String? title;
  final String? url;

  factory LocalityMediaRef.fromJson(Map<String, dynamic> json) => _$LocalityMediaRefFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityMediaRefToJson(this);
}
