import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'instrument_window.g.dart';

/// Instrument Window
@JsonSerializable(includeIfNull: false)
class LegalInstrumentWindow {
  const LegalInstrumentWindow({this.kindTerm, this.limit, this.offset});
  final String? kindTerm;
  final int? limit;
  final int? offset;

  factory LegalInstrumentWindow.fromJson(Map<String, dynamic> json) => _$LegalInstrumentWindowFromJson(json);

  Map<String, dynamic> toJson() => _$LegalInstrumentWindowToJson(this);
}
