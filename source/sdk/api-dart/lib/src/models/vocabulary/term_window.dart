import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'term_window.g.dart';

/// Term Window
@JsonSerializable(includeIfNull: false)
class VocabularyTermWindow {
  const VocabularyTermWindow({this.limit, this.offset, required this.schemeId});
  final int? limit;
  final int? offset;
  final String schemeId;

  factory VocabularyTermWindow.fromJson(Map<String, dynamic> json) => _$VocabularyTermWindowFromJson(json);

  Map<String, dynamic> toJson() => _$VocabularyTermWindowToJson(this);
}
