import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legal/effect_entry.dart';

part 'effect_collection.g.dart';

/// Effect Collection
@JsonSerializable(includeIfNull: false)
class LegalEffectCollection {
  const LegalEffectCollection({required this.effects});
  final List<LegalEffectEntry> effects;

  factory LegalEffectCollection.fromJson(Map<String, dynamic> json) => _$LegalEffectCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$LegalEffectCollectionToJson(this);
}
