import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legal/instrument_entry.dart';

part 'instrument_collection.g.dart';

/// Instrument Collection
@JsonSerializable(includeIfNull: false)
class LegalInstrumentCollection {
  const LegalInstrumentCollection({required this.instruments});
  final List<LegalInstrumentEntry> instruments;

  factory LegalInstrumentCollection.fromJson(Map<String, dynamic> json) => _$LegalInstrumentCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$LegalInstrumentCollectionToJson(this);
}
