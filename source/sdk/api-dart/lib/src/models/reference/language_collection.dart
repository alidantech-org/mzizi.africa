import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/language_entry.dart';

part 'language_collection.g.dart';

/// Language Collection
@JsonSerializable(includeIfNull: false)
class ReferenceLanguageCollection {
  const ReferenceLanguageCollection({required this.languages});
  final List<ReferenceLanguageEntry> languages;

  factory ReferenceLanguageCollection.fromJson(Map<String, dynamic> json) => _$ReferenceLanguageCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceLanguageCollectionToJson(this);
}
