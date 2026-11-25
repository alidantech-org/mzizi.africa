import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/language_entry_names.dart';

part 'language_entry.g.dart';

/// Language Entry
@JsonSerializable(includeIfNull: false)
class ReferenceLanguageEntry {
  const ReferenceLanguageEntry({
    required this.code,
    this.directionTerm,
    this.iso6391,
    this.iso6393,
    required this.languageId,
    required this.names,
  });
  final String code;
  final String? directionTerm;
  final String? iso6391;
  final String? iso6393;
  final String languageId;
  final List<ReferenceLanguageEntryNames> names;

  factory ReferenceLanguageEntry.fromJson(Map<String, dynamic> json) => _$ReferenceLanguageEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceLanguageEntryToJson(this);
}
