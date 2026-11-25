import 'package:json_annotation/json_annotation.dart';

part 'use_entry_captions.g.dart';

/// Use Entry Captions
@JsonSerializable(includeIfNull: false)
class MediaUseEntryCaptions {
  const MediaUseEntryCaptions({this.altText, required this.languageCode, this.title});
  final String? altText;
  final String languageCode;
  final String? title;

  factory MediaUseEntryCaptions.fromJson(Map<String, dynamic> json) => _$MediaUseEntryCaptionsFromJson(json);

  Map<String, dynamic> toJson() => _$MediaUseEntryCaptionsToJson(this);
}
