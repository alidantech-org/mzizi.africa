import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/vocabulary/term_entry.dart';

part 'term_collection.g.dart';

/// Term Collection
@JsonSerializable(includeIfNull: false)
class VocabularyTermCollection {
  const VocabularyTermCollection({required this.terms});
  final List<VocabularyTermEntry> terms;

  factory VocabularyTermCollection.fromJson(Map<String, dynamic> json) => _$VocabularyTermCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$VocabularyTermCollectionToJson(this);
}
